import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NodeSelection } from '@tiptap/pm/state'
import { Activity } from 'react'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import { BLOCK_DRAG_TYPE } from './BlockActions'
import { planConversion } from './blockConversion'

import type { RichTextFeature, RichTextJSON } from '../../types'
import type { Editor, JSONContent, TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

vi.mock('./blockConversion', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  return { ...actual, planConversion: vi.fn(actual.planConversion as typeof planConversion) }
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>{children}</EnvironmentProvider>
  </IntlProvider>
)

const FEATURES: RichTextFeature[] = ['blockActions', 'heading', 'bulletList', 'table', 'image']

const paragraph = (text?: string): JSONContent =>
  text ? { type: 'paragraph', content: [{ type: 'text', text }] } : { type: 'paragraph' }
const heading = (text: string): JSONContent => ({
  type: 'heading',
  attrs: { level: 2 },
  content: [{ type: 'text', text }],
})
const doc = (content: JSONContent[]): RichTextJSON => ({ type: 'doc', content })

const ABC = doc([paragraph('aa'), paragraph('bb'), paragraph('cc')])

type EditorProps = {
  features?: RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  defaultValue?: RichTextJSON
  value?: RichTextJSON
  hideToolbar?: boolean
  readOnly?: boolean
  disabled?: boolean
}

const getEditorDom = () => screen.getByRole('textbox', { name: '本文' })
const getEditor = (): Editor => (getEditorDom() as TiptapEditorHTMLElement).editor!

const DEFAULT_PROPS: EditorProps = { features: FEATURES, defaultValue: ABC }

const renderEditor = async (initial: EditorProps = {}) => {
  const ui = (props: EditorProps) => (
    <RichTextEditor {...DEFAULT_PROPS} {...initial} {...props} aria-label="本文" />
  )
  const { rerender } = render(ui({}), { wrapper: Wrapper })
  await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

  return { rerender: (props: EditorProps) => rerender(ui(props)) }
}

const outline = () => {
  const result: string[] = []

  getEditor().state.doc.forEach((node) => {
    result.push(node.textContent || node.type.name)
  })

  return result
}

const placeCaret = (text: string, offset = 0) => {
  const editor = getEditor()
  let found = -1

  editor.state.doc.descendants((node, pos) => {
    if (found === -1 && node.isText && node.text === text) found = pos + offset
  })

  act(() => {
    editor.commands.setTextSelection(found)
    editor.view.focus()
  })
}

/** jsdom は Apple の環境ではないので、移動は Alt+Shift+↑/↓ */
const pressMove = (key: 'ArrowUp' | 'ArrowDown') =>
  fireEvent.keyDown(getEditorDom(), { key, altKey: true, shiftKey: true })

const pressMenuKey = () => fireEvent.keyDown(getEditorDom(), { key: '/', ctrlKey: true })

const announcement = () => screen.getByRole('status').textContent

const queryMenu = () => screen.queryByRole('menu', { name: 'ブロックの操作' })
const getMenu = () => screen.getByRole('menu', { name: 'ブロックの操作' })
const getMenuItem = (name: string) => within(getMenu()).getByRole('menuitem', { name })
const getConversionItem = (name: string) => within(getMenu()).getByRole('menuitemradio', { name })
const queryConversionGroup = () => within(getMenu()).queryByRole('group', { name: '変換' })
const conversionNames = () =>
  within(getMenu())
    .queryAllByRole('menuitemradio')
    .map((item) => item.textContent)
const checkedNames = () =>
  within(getMenu())
    .queryAllByRole('menuitemradio', { checked: true })
    .map((item) => item.textContent)

const IMAGE: JSONContent = { type: 'image', attrs: { src: '/a.png', alt: 'ロゴ' } }

const selectNode = (pos: number) => {
  const editor = getEditor()

  act(() => {
    editor.commands.setNodeSelection(pos)
    editor.view.focus()
  })
}

const openMenuByKey = async () => {
  pressMenuKey()
  await waitFor(() => expect(queryMenu()).toBeInTheDocument())
  await waitFor(() => expect(document.activeElement?.getAttribute('role')).toMatch(/^menuitem/))
}

const HANDLE_TITLE = 'ドラッグで移動、クリックでメニューを開く'

const getGrip = () => screen.getByTitle(HANDLE_TITLE)

/** jsdom はレイアウトしないので、最上位のブロックを 40px おきに縦に並べた矩形を返す */
const stubBlockRects = () => {
  const editor = getEditor()

  vi.spyOn(editor.view.dom, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 500, 400))
  editor.state.doc.forEach((_node, offset, index) => {
    vi.spyOn(editor.view.nodeDOM(offset) as HTMLElement, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(40, index * 40, 400, 30),
    )
  })
}

const nextFrame = () =>
  act(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())))

const hoverBlock = async (index: number) => {
  stubBlockRects()
  fireEvent.mouseMove(getEditorDom(), { clientY: index * 40 + 10 })
  await nextFrame()
}

const recordUncaughtErrors = () => {
  const errors: unknown[] = []
  const listener = (e: ErrorEvent) => {
    errors.push(e.error)
    e.preventDefault()
  }

  window.addEventListener('error', listener)
  onTestFinished(() => window.removeEventListener('error', listener))

  return errors
}

const recordKeysReachingDocument = () => {
  const keys: string[] = []
  const listener = (e: KeyboardEvent) => keys.push(e.key)

  document.addEventListener('keydown', listener)
  onTestFinished(() => document.removeEventListener('keydown', listener))

  return keys
}

const pressShortcut = (shortcut: string) => {
  const parts = shortcut.split('+')

  return fireEvent.keyDown(getEditorDom(), {
    key: parts[parts.length - 1],
    altKey: parts.includes('Alt'),
    ctrlKey: parts.includes('Control'),
    metaKey: parts.includes('Meta'),
    shiftKey: parts.includes('Shift'),
  })
}

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('移動のキー', () => {
  it('Alt+Shift+↑/↓ でキャレットのあるブロックを動かし、移した先を読み上げる', async () => {
    await renderEditor({
      defaultValue: doc([paragraph('aa'), heading('はじめに'), paragraph('cc')]),
    })
    placeCaret('はじめに', 2)

    expect(pressMove('ArrowUp')).toBe(false)

    expect(outline()).toEqual(['はじめに', 'aa', 'cc'])
    await waitFor(() =>
      expect(announcement()).toBe('見出し2「はじめに」を3個中1番目に移動しました'),
    )

    pressMove('ArrowDown')
    pressMove('ArrowDown')

    expect(outline()).toEqual(['aa', 'cc', 'はじめに', 'paragraph'])
    await waitFor(() =>
      expect(announcement()).toBe('見出し2「はじめに」を3個中3番目に移動しました'),
    )

    pressMove('ArrowDown')

    await waitFor(() => expect(announcement()).toBe('最後のブロックです'))
  })

  it('長い文は先頭の 20 文字だけを読み上げる', async () => {
    const long = 'あいうえおかきくけこさしすせそたちつてとなにぬねの'
    await renderEditor({ defaultValue: doc([paragraph('aa'), paragraph(long)]) })
    placeCaret(long)

    pressMove('ArrowUp')

    await waitFor(() =>
      expect(announcement()).toBe(
        '段落「あいうえおかきくけこさしすせそたちつてと…」を2個中1番目に移動しました',
      ),
    )
  })

  it('複数のブロックを選んで動かすと、個数を読み上げる', async () => {
    await renderEditor()
    const editor = getEditor()
    act(() => {
      editor.commands.setTextSelection({ from: 2, to: 6 })
      editor.view.focus()
    })

    pressMove('ArrowDown')

    expect(outline()).toEqual(['cc', 'aa', 'bb'])
    await waitFor(() => expect(announcement()).toBe('2個のブロックを3個中2番目に移動しました'))
  })

  it('先頭で ↑ を押すと、文書も選択も変えずにキーを奪い、先頭であることを読み上げる', async () => {
    await renderEditor()
    placeCaret('aa', 1)
    const { selection } = getEditor().state

    expect(pressMove('ArrowUp')).toBe(false)

    expect(outline()).toEqual(['aa', 'bb', 'cc'])
    expect(getEditor().state.selection.eq(selection)).toBe(true)
    await waitFor(() => expect(announcement()).toBe('先頭のブロックです'))
  })

  it('末尾で ↓ を押すと、末尾であることを読み上げる', async () => {
    await renderEditor()
    placeCaret('cc')

    pressMove('ArrowDown')

    expect(outline()).toEqual(['aa', 'bb', 'cc'])
    await waitFor(() => expect(announcement()).toBe('最後のブロックです'))
  })

  it('同じ知らせが続いても、一度空にしてから書き直す', async () => {
    await renderEditor()
    placeCaret('aa')
    pressMove('ArrowUp')
    await waitFor(() => expect(announcement()).toBe('先頭のブロックです'))

    pressMove('ArrowUp')

    expect(announcement()).toBe('')
    await waitFor(() => expect(announcement()).toBe('先頭のブロックです'))
  })

  it('features に blockActions が無ければ、キーを奪わず読み上げの場所も置かない', async () => {
    await renderEditor({ features: ['heading'] })
    placeCaret('bb')

    expect(pressMove('ArrowUp')).toBe(true)

    expect(outline()).toEqual(['aa', 'bb', 'cc'])
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('変換の読み上げ', () => {
  it.each([
    {
      name: '1 つのブロック',
      run: (editor: Editor) => editor.commands.convertBlocks({ to: 'paragraph' }),
      expected: '見出し2「はじめに」を標準テキストに変換しました',
    },
    {
      name: '3 つのブロック',
      run: (editor: Editor) => editor.chain().selectAll().convertBlocks({ to: 'bulletList' }).run(),
      expected: '3個のブロックを箇条書きリストに変換しました',
    },
  ])('$name を変換すると、変換前の範囲と変換先の名前を読み上げる', async ({ run, expected }) => {
    await renderEditor({
      defaultValue: doc([heading('はじめに'), paragraph('bb'), paragraph('cc')]),
    })
    placeCaret('はじめに', 1)

    act(() => {
      run(getEditor())
    })

    await waitFor(() => expect(announcement()).toBe(expected))
  })
})

describe('表示の条件', () => {
  it('hideToolbar でも移動のキーと読み上げは効き、ブロックメニューのキーは奪わない', async () => {
    await renderEditor({ hideToolbar: true })
    placeCaret('bb')

    pressMove('ArrowUp')

    expect(outline()).toEqual(['bb', 'aa', 'cc'])
    await waitFor(() => expect(announcement()).toBe('段落「bb」を3個中1番目に移動しました'))
    expect(pressMenuKey()).toBe(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it.each([{ readOnly: true }, { disabled: true }])(
    '%o ではキーが効かず、読み上げの場所も置かない',
    async (props) => {
      await renderEditor(props)
      const editor = getEditor()
      act(() => {
        editor.commands.setTextSelection(5)
      })

      pressMove('ArrowUp')
      pressMenuKey()

      expect(outline()).toEqual(['aa', 'bb', 'cc'])
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    },
  )
})

describe('ブロックメニュー', () => {
  it('Ctrl+/ で開き、使える最初の項目にフォーカスを移す。先頭のブロックでは上へ移動を使えない', async () => {
    await renderEditor({ defaultValue: doc([IMAGE, paragraph('bb')]) })
    selectNode(0)

    await openMenuByKey()

    expect(queryConversionGroup()).not.toBeInTheDocument()
    expect(getMenuItem('上へ移動')).toHaveAttribute('aria-disabled', 'true')
    expect(getMenuItem('下へ移動')).toHaveFocus()
    expect(getMenuItem('複製')).not.toHaveAttribute('aria-disabled')
    expect(getMenuItem('削除')).not.toHaveAttribute('aria-disabled')
  })

  it('移動の項目に示したキーを本文で押すと、そのとおりに動く', async () => {
    await renderEditor()
    placeCaret('bb')
    await openMenuByKey()
    const shortcut = getMenuItem('上へ移動').getAttribute('aria-keyshortcuts')!
    await userEvent.keyboard('{Escape}')

    expect(pressShortcut(shortcut)).toBe(false)

    expect(outline()).toEqual(['bb', 'aa', 'cc'])
  })

  it('下へ移動を選ぶと、動かして閉じ、キャレットを動かしたブロックに残したまま本文へ戻る', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('bb', 1)
    await openMenuByKey()

    await user.click(getMenuItem('下へ移動'))

    expect(outline()).toEqual(['aa', 'cc', 'bb'])
    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()
    expect(getEditor().state.selection.$head.parent.textContent).toBe('bb')
    expect(getEditor().state.selection.$head.parentOffset).toBe(1)
    await waitFor(() => expect(announcement()).toBe('段落「bb」を3個中3番目に移動しました'))
  })

  it('複製を Enter で選ぶと、すぐ下に複製してキャレットを複製に置き、読み上げる', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('bb')
    await openMenuByKey()

    getMenuItem('複製').focus()
    await user.keyboard('{Enter}')

    expect(outline()).toEqual(['aa', 'bb', 'bb', 'cc'])
    expect(getEditor().state.selection.$head.index(0)).toBe(2)
    expect(getEditorDom()).toHaveFocus()
    await waitFor(() => expect(announcement()).toBe('段落「bb」を複製しました'))
  })

  it('削除を選ぶと、消して次のブロックの先頭にキャレットを置き、読み上げる', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('bb', 1)
    await openMenuByKey()

    await user.click(getMenuItem('削除'))

    expect(outline()).toEqual(['aa', 'cc'])
    expect(getEditor().state.selection.$head.parent.textContent).toBe('cc')
    expect(getEditor().state.selection.$head.parentOffset).toBe(0)
    await waitFor(() => expect(announcement()).toBe('段落「bb」を削除しました'))
  })

  it('Esc で閉じて本文の同じ選択へ戻り、Esc は document まで届かない', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('bb', 1)
    const { selection } = getEditor().state
    await openMenuByKey()
    const keys = recordKeysReachingDocument()

    await user.keyboard('{Escape}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()
    expect(getEditor().state.selection.eq(selection)).toBe(true)
    expect(keys).not.toContain('Escape')
  })

  it('↑↓ で項目を移り、Tab で閉じて本文へ戻る', async () => {
    const user = userEvent.setup()
    await renderEditor({ defaultValue: doc([paragraph('aa'), IMAGE, paragraph('cc')]) })
    selectNode(4)
    await openMenuByKey()
    expect(getMenuItem('上へ移動')).toHaveFocus()

    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(getMenuItem('複製')).toHaveFocus()
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}')
    expect(getMenuItem('削除')).toHaveFocus()
    await user.keyboard('{End}')
    expect(getMenuItem('削除')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(getMenuItem('上へ移動')).toHaveFocus()

    await user.keyboard('{Tab}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()
  })

  it('開いている間に文書が変わると閉じる', async () => {
    await renderEditor()
    placeCaret('bb')
    await openMenuByKey()

    act(() => {
      getEditor().commands.insertContentAt(1, 'zz')
    })

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('画像を選んでいても開き、画像を対象にする', async () => {
    const user = userEvent.setup()
    await renderEditor({
      defaultValue: doc([
        paragraph('aa'),
        { type: 'image', attrs: { src: '/a.png', alt: 'ロゴ' } },
        paragraph('cc'),
      ]),
    })
    const editor = getEditor()
    act(() => {
      editor.commands.setNodeSelection(4)
      editor.view.focus()
    })
    await openMenuByKey()

    await user.click(getMenuItem('複製'))

    expect(outline()).toEqual(['aa', 'image', 'image', 'cc'])
    expect(getEditor().state.selection).toBeInstanceOf(NodeSelection)
    await waitFor(() => expect(announcement()).toBe('画像「ロゴ」を複製しました'))
  })

  it('表のセルの中では、表全体を対象にする', async () => {
    const user = userEvent.setup()
    const cell = (text: string): JSONContent => ({ type: 'tableCell', content: [paragraph(text)] })
    await renderEditor({
      defaultValue: doc([
        paragraph('aa'),
        { type: 'table', content: [{ type: 'tableRow', content: [cell('x'), cell('y')] }] },
        paragraph('cc'),
      ]),
    })
    placeCaret('y')
    await openMenuByKey()

    await user.click(getMenuItem('上へ移動'))

    expect(outline()).toEqual(['xy', 'aa', 'cc'])
    await waitFor(() => expect(announcement()).toBe('表「x y」を3個中1番目に移動しました'))
  })
})

describe('ブロックメニューの変換', () => {
  const ALL: RichTextFeature[] = [
    'blockActions',
    'heading',
    'bulletList',
    'orderedList',
    'blockquote',
    'codeBlock',
    'table',
    'image',
  ]
  const CONVERSION_NAMES = [
    '標準テキスト',
    '見出し1',
    '見出し2',
    '見出し3',
    '見出し4',
    '箇条書きリスト',
    '番号付きリスト',
    '引用',
    'コードブロック',
  ]
  const IMAGE_DOC = doc([paragraph('aa'), IMAGE, paragraph('cc')])

  const recordScrolls = () => {
    const scrolls: boolean[] = []

    getEditor().on('transaction', ({ transaction }) => scrolls.push(transaction.scrolledIntoView))

    return scrolls
  }

  it('Ctrl+/ で開くと、上に「変換」の群があり、変換先をカタログの順に並べ、今の種類だけにチェックを付けてフォーカスを移す', async () => {
    await renderEditor({ features: ALL })
    placeCaret('bb')

    await openMenuByKey()

    const group = queryConversionGroup()!
    expect(
      within(group)
        .getAllByRole('menuitemradio')
        .map((item) => item.textContent),
    ).toEqual(CONVERSION_NAMES)
    expect(checkedNames()).toEqual(['標準テキスト'])
    expect(getConversionItem('標準テキスト')).toHaveFocus()
    expect(within(getMenu()).getByRole('separator')).toBeInTheDocument()
    expect(
      group.compareDocumentPosition(getMenuItem('上へ移動')) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it.each([
    {
      name: '見出し2の上では、今の種類の見出し2',
      content: [paragraph('aa'), heading('bb'), paragraph('cc')],
      select: () => placeCaret('bb'),
      focused: () => getConversionItem('見出し2'),
    },
    {
      name: '段落と見出しが混ざる範囲では、今の種類が無いので先頭の標準テキスト',
      content: [paragraph('aa'), heading('bb'), paragraph('cc')],
      select: () => {
        const editor = getEditor()

        act(() => {
          editor.commands.setTextSelection({ from: 2, to: 6 })
          editor.view.focus()
        })
      },
      focused: () => getConversionItem('標準テキスト'),
    },
    {
      name: '画像の上では、変換の項目が無いので使える最初の操作の上へ移動',
      content: [paragraph('aa'), IMAGE, paragraph('cc')],
      select: () => selectNode(4),
      focused: () => getMenuItem('上へ移動'),
    },
  ])('開いたときのフォーカスは、$name', async ({ content, select, focused }) => {
    await renderEditor({ features: ALL, defaultValue: doc(content) })
    select()

    await openMenuByKey()

    expect(focused()).toHaveFocus()
  })

  it('許されていない見出しレベルと、features に無い種類は出さない', async () => {
    await renderEditor({
      features: ALL.filter((feature) => feature !== 'codeBlock'),
      headingLevels: [2, 3],
    })
    placeCaret('bb')

    await openMenuByKey()

    expect(conversionNames()).toEqual([
      '標準テキスト',
      '見出し2',
      '見出し3',
      '箇条書きリスト',
      '番号付きリスト',
      '引用',
    ])
  })

  it('⋮⋮ で画像のメニューを開くと、変換の群も区切りも出さず、使える最初の操作にフォーカスを移す', async () => {
    const user = userEvent.setup()
    await renderEditor({ features: ALL, defaultValue: IMAGE_DOC })

    await hoverBlock(1)
    await user.click(screen.getByTitle(HANDLE_TITLE))

    await waitFor(() => expect(getMenuItem('上へ移動')).toHaveFocus())
    expect(queryConversionGroup()).not.toBeInTheDocument()
    expect(conversionNames()).toEqual([])
    expect(within(getMenu()).queryByRole('separator')).not.toBeInTheDocument()
  })

  it('選べる変換先が今の種類しか無ければ、変換の群も区切りも出さず、使える最初の操作にフォーカスを移す', async () => {
    await renderEditor({ features: ['blockActions'] })
    placeCaret('bb')

    await openMenuByKey()

    expect(queryConversionGroup()).not.toBeInTheDocument()
    expect(conversionNames()).toEqual([])
    expect(within(getMenu()).queryByRole('separator')).not.toBeInTheDocument()
    expect(getMenuItem('上へ移動')).toHaveFocus()
  })

  it('features に無い種類のブロックを読み込んでいれば、今の種類でない標準テキストだけの群を出す', async () => {
    await renderEditor({
      features: ['blockActions'],
      defaultValue: doc([paragraph('aa'), heading('bb'), paragraph('cc')]),
    })
    placeCaret('bb')

    await openMenuByKey()

    expect(conversionNames()).toEqual(['標準テキスト'])
    expect(checkedNames()).toEqual([])
    expect(within(getMenu()).getByRole('separator')).toBeInTheDocument()
    expect(getConversionItem('標準テキスト')).toHaveFocus()
  })

  it('↓ ↓ Enter で見出し2を選ぶと、変換して閉じ、本文へ戻り、読み上げる', async () => {
    const user = userEvent.setup()
    await renderEditor({ features: ALL })
    placeCaret('bb', 1)
    await openMenuByKey()

    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(getConversionItem('見出し2')).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(getEditor().state.doc.child(1).type.name).toBe('heading')
    expect(getEditor().state.doc.child(1).attrs.level).toBe(2)
    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()
    expect(getEditor().state.selection.$head.parentOffset).toBe(1)
    await waitFor(() => expect(announcement()).toBe('段落「bb」を見出し2に変換しました'))
  })

  it('チェックの付いた項目を選ぶと、文書を変えずに閉じ、読み上げない', async () => {
    const user = userEvent.setup()
    await renderEditor({ features: ALL })
    placeCaret('bb', 1)
    const before = getEditor().state.doc
    await openMenuByKey()

    await user.click(getConversionItem('標準テキスト'))

    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()
    expect(getEditor().state.doc.eq(before)).toBe(true)
    expect(getEditor().can().undo()).toBe(false)
    await act(() => new Promise((resolve) => setTimeout(resolve, 200)))
    expect(announcement()).toBe('')
  })

  it('↑↓・Home・End は変換の項目と操作の項目をまたいで循環し、群のラベルと区切りには止まらない', async () => {
    const user = userEvent.setup()
    await renderEditor({ features: ALL })
    placeCaret('bb')
    await openMenuByKey()

    await user.keyboard('{ArrowUp}')
    expect(getMenuItem('削除')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(getConversionItem('標準テキスト')).toHaveFocus()
    await user.keyboard('{End}')
    expect(getMenuItem('削除')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(getConversionItem('標準テキスト')).toHaveFocus()

    await user.keyboard('{ArrowDown}'.repeat(CONVERSION_NAMES.length))
    expect(getMenuItem('上へ移動')).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(getConversionItem('コードブロック')).toHaveFocus()

    await user.keyboard('{ArrowDown}'.repeat(CONVERSION_NAMES.length + 4))
    expect(getConversionItem('コードブロック')).toHaveFocus()
  })

  it('段落と見出しが混ざる範囲では、どの項目にもチェックを付けない', async () => {
    await renderEditor({
      features: ALL,
      defaultValue: doc([paragraph('aa'), heading('bb'), paragraph('cc')]),
    })
    const editor = getEditor()
    act(() => {
      editor.commands.setTextSelection({ from: 2, to: 6 })
      editor.view.focus()
    })

    await openMenuByKey()

    expect(conversionNames()).toEqual(CONVERSION_NAMES)
    expect(checkedNames()).toEqual([])
  })

  it('⋮⋮ で選択の外のブロックを変換しても、本文の選択は変わらず、スクロールもしない', async () => {
    const user = userEvent.setup()
    await renderEditor({ features: ALL })
    placeCaret('aa', 1)
    const { selection } = getEditor().state
    const scrolls = recordScrolls()

    await hoverBlock(2)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await user.click(await screen.findByRole('menuitemradio', { name: '見出し1' }))

    expect(outline()).toEqual(['aa', 'bb', 'cc', 'paragraph'])
    expect(getEditor().state.doc.child(2).type.name).toBe('heading')
    expect(getEditor().state.selection.eq(selection)).toBe(true)
    expect(scrolls).not.toContain(true)
    await waitFor(() => expect(announcement()).toBe('段落「cc」を見出し1に変換しました'))
  })

  it('開いている間にスクロールで描き直しても、閉じても、変換先を組み直さない', async () => {
    const user = userEvent.setup()
    await renderEditor({ features: ALL })
    vi.mocked(planConversion).mockClear()

    await hoverBlock(1)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    expect(planConversion).toHaveBeenCalled()

    const dropdown = getMenu().parentElement!
    const { top } = dropdown.style
    vi.mocked(planConversion).mockClear()

    vi.spyOn(getEditor().view.nodeDOM(4) as HTMLElement, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(40, 200, 400, 30),
    )
    fireEvent.scroll(document)

    expect(dropdown.style.top).not.toBe(top)

    await user.keyboard('{Escape}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(planConversion).not.toHaveBeenCalled()
  })
})

describe('つまみ', () => {
  it('ブロックに乗せると ⋮⋮ を出し、クリックするとそのブロックを対象にブロックメニューを開く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('aa')

    await hoverBlock(2)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    await user.click(getMenuItem('削除'))

    expect(outline()).toEqual(['aa', 'bb'])
    expect(getEditorDom()).toHaveFocus()
  })

  it('⋮⋮ のメニューで動かすと、キャレットを動かしたブロックの先頭に置く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('aa', 1)

    await hoverBlock(2)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await user.click(await screen.findByRole('menuitem', { name: '上へ移動' }))

    expect(outline()).toEqual(['aa', 'cc', 'bb'])
    expect(getEditor().state.selection.$head.parent.textContent).toBe('cc')
    expect(getEditor().state.selection.$head.parentOffset).toBe(0)
  })

  it('本文にフォーカスがあればキャレットのブロックに出し、マウスを乗せると乗せたブロックへ、文字を打つとキャレットのブロックへ戻す', async () => {
    await renderEditor()
    placeCaret('aa')
    await nextFrame()
    expect(getGrip()).toHaveAccessibleName('段落「aa」の操作')

    await hoverBlock(1)
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')

    fireEvent.keyDown(getEditorDom(), { key: 'a' })
    await nextFrame()
    expect(getGrip()).toHaveAccessibleName('段落「aa」の操作')
  })

  it('本文からフォーカスが外れ、マウスも乗っていなければ出さない', async () => {
    const user = userEvent.setup()
    render(
      <>
        <RichTextEditor {...DEFAULT_PROPS} aria-label="本文" />
        <button type="button">外</button>
      </>,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('aa')
    await nextFrame()
    expect(getGrip()).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '外' }))
    await nextFrame()
    expect(screen.queryByTitle(HANDLE_TITLE)).not.toBeInTheDocument()
  })

  it('hideToolbar ではつまみもメニューも出さない', async () => {
    await renderEditor({ hideToolbar: true })
    placeCaret('aa')

    await hoverBlock(1)
    pressMenuKey()
    await nextFrame()

    expect(screen.queryByTitle(HANDLE_TITLE)).not.toBeInTheDocument()
    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('⋮⋮ で開いたメニューの間はポインタが外れてもそのブロックに出したままにし、閉じると本文へ戻ってキャレットのブロックに出す', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('aa')
    await hoverBlock(1)
    await user.click(getGrip())
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    expect(getGrip()).toHaveAttribute('aria-expanded', 'true')

    await user.hover(getMenuItem('下へ移動'))
    await nextFrame()
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')

    await user.keyboard('{Escape}')
    await nextFrame()
    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「aa」の操作')
    expect(getGrip()).toHaveAttribute('aria-expanded', 'false')
  })

  it('⋮⋮ で開いたメニューは、もう一度 ⋮⋮ を押すと閉じ、その次に押すとまた開く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    await hoverBlock(1)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())

    await user.click(screen.getByTitle(HANDLE_TITLE))
    await nextFrame()
    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).toHaveFocus()

    await hoverBlock(1)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(queryMenu()).toBeInTheDocument())
  })

  it('value でブロックが減っても、⋮⋮ は今あるブロックだけを対象にする', async () => {
    const user = userEvent.setup()
    const errors = recordUncaughtErrors()
    const { rerender } = await renderEditor({ value: ABC })
    await hoverBlock(2)

    rerender({ value: doc([paragraph('aa')]) })
    fireEvent.click(screen.getByTitle(HANDLE_TITLE))

    expect(errors).toEqual([])
    expect(queryMenu()).not.toBeInTheDocument()

    await nextFrame()
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await user.click(await screen.findByRole('menuitem', { name: '複製' }))

    expect(errors).toEqual([])
    expect(outline()).toEqual(['aa', 'aa'])
  })
})

describe('キーボードでのつまみへの移動', () => {
  const pressLeft = (init: KeyboardEventInit = {}) =>
    fireEvent.keyDown(getEditorDom(), { ...init, key: 'ArrowLeft' })
  const pressOnGrip = (key: string) => fireEvent.keyDown(getGrip(), { key })
  const caret = () => {
    const { $head } = getEditor().state.selection

    return [$head.parent.textContent, $head.parentOffset]
  }
  const listItem = (text: string): JSONContent => ({ type: 'listItem', content: [paragraph(text)] })

  it('ブロックの先頭で ← を押すと、そのブロックの ⋮⋮ にフォーカスを移し、→ で本文のそのブロックの先頭へ戻る', async () => {
    await renderEditor()
    placeCaret('bb')

    expect(pressLeft()).toBe(false)
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveRole('button')
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')
    expect(getGrip()).toHaveAttribute('aria-haspopup', 'menu')
    expect(getGrip()).toHaveAttribute('aria-expanded', 'false')

    pressOnGrip('ArrowRight')
    expect(getEditorDom()).toHaveFocus()
    expect(caret()).toEqual(['bb', 0])
  })

  it('ブロックの途中や、Shift を押しているときは ← を奪わない', async () => {
    await renderEditor()
    placeCaret('bb', 1)
    expect(pressLeft()).toBe(true)

    placeCaret('bb')
    expect(pressLeft({ shiftKey: true })).toBe(true)
    expect(getEditorDom()).toHaveFocus()
  })

  it('リストは最初の項目の先頭でだけ、画像は選んでいるときに ⋮⋮ へ移る', async () => {
    await renderEditor({
      defaultValue: doc([
        paragraph('aa'),
        { type: 'bulletList', content: [listItem('x'), listItem('y')] },
        IMAGE,
        paragraph('cc'),
      ]),
    })
    placeCaret('y')
    expect(pressLeft()).toBe(true)

    placeCaret('x')
    expect(pressLeft()).toBe(false)
    expect(getGrip()).toHaveAccessibleName('箇条書きリスト「x y」の操作')

    let imagePos = -1

    getEditor().state.doc.forEach((node, offset) => {
      if (node.type.name === 'image') imagePos = offset
    })
    selectNode(imagePos)
    expect(pressLeft()).toBe(false)
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('画像「ロゴ」の操作')
  })

  it('表は最初のセルの先頭で ← を押すと、表の前へ抜けずに表の ⋮⋮ へ移る', async () => {
    const cell = (text: string): JSONContent => ({ type: 'tableCell', content: [paragraph(text)] })

    await renderEditor({
      defaultValue: doc([
        paragraph('aa'),
        { type: 'table', content: [{ type: 'tableRow', content: [cell('t1'), cell('t2')] }] },
        paragraph('cc'),
      ]),
    })
    placeCaret('t1')

    expect(pressLeft()).toBe(false)
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('表「t1 t2」の操作')
    expect(caret()).toEqual(['t1', 0])
  })

  it('⋮⋮ で ← を押すと前のブロックの末尾へ移り、先頭のブロックでは ⋮⋮ に留まる', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()

    pressOnGrip('ArrowLeft')
    expect(getEditorDom()).toHaveFocus()
    expect(caret()).toEqual(['aa', 2])

    placeCaret('aa')
    pressLeft()
    pressOnGrip('ArrowLeft')
    expect(getGrip()).toHaveFocus()
    expect(caret()).toEqual(['aa', 0])
  })

  it('⋮⋮ で ↑↓ を押すと、前後のブロックの ⋮⋮ へ移り、キャレットもそのブロックの先頭へ移る。端では動かない', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()

    pressOnGrip('ArrowDown')
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「cc」の操作')
    expect(caret()).toEqual(['cc', 0])

    pressOnGrip('ArrowDown')
    expect(getGrip()).toHaveAccessibleName('段落「cc」の操作')

    pressOnGrip('ArrowUp')
    pressOnGrip('ArrowUp')
    pressOnGrip('ArrowUp')
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「aa」の操作')
    expect(caret()).toEqual(['aa', 0])
  })

  it('⋮⋮ で Enter を押すとそのブロックのメニューを開き、Esc で閉じると ⋮⋮ へ戻る', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()

    pressOnGrip('Enter')
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    expect(getGrip()).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await waitFor(() => expect(queryMenu()).not.toBeInTheDocument())
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')
  })

  it('メニューを閉じて ⋮⋮ に戻った時点で、閉じたことを伝える', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()
    pressOnGrip('Enter')
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())

    const expandedOnFocus: Array<string | null> = []
    const grip = getGrip()

    grip.addEventListener('focus', () => expandedOnFocus.push(grip.getAttribute('aria-expanded')))
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await waitFor(() => expect(grip).toHaveFocus())

    expect(expandedOnFocus).toEqual(['false'])
  })

  it('⋮⋮ のメニューで変換すると、戻った ⋮⋮ は変換したあとの名前を持つ', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()
    pressOnGrip('Enter')
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())

    const nameOnFocus: Array<string | null> = []
    const grip = getGrip()

    grip.addEventListener('focus', () => nameOnFocus.push(grip.getAttribute('aria-label')))
    fireEvent.click(getConversionItem('見出し2'))
    await waitFor(() => expect(grip).toHaveFocus())

    expect(nameOnFocus).toEqual(['見出し2「bb」の操作'])
  })

  it('⋮⋮ では、修飾キー付きのショートカットを ⋮⋮ のまま本文と同じに効かせる', async () => {
    await renderEditor()
    placeCaret('aa')
    pressLeft()

    fireEvent.keyDown(getGrip(), { key: 'ArrowDown', altKey: true, shiftKey: true })

    expect(outline()).toEqual(['bb', 'aa', 'cc'])
    await nextFrame()
    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「aa」の操作')
  })

  it('⋮⋮ で文字のキーを押すと、文字は入れずに本文のそのブロックの先頭へ戻す。Backspace と Delete は何もしない', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()

    pressOnGrip('Backspace')
    pressOnGrip('Delete')
    expect(outline()).toEqual(['aa', 'bb', 'cc'])
    expect(getGrip()).toHaveFocus()

    expect(pressOnGrip('x')).toBe(false)
    expect(getEditorDom()).toHaveFocus()
    expect(caret()).toEqual(['bb', 0])
    expect(outline()).toEqual(['aa', 'bb', 'cc'])
  })

  it('⋮⋮ のメニューを開いたまま外の何もない所を押すと、onBlur を呼ぶ', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    render(
      <RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onFocus={onFocus} onBlur={onBlur} />,
      {
        wrapper: Wrapper,
      },
    )
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')
    pressLeft()
    pressOnGrip('Enter')
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())

    fireEvent.mouseDown(document.body)

    await waitFor(() => expect(queryMenu()).not.toBeInTheDocument())
    await waitFor(() => expect(onBlur).toHaveBeenCalledTimes(1))

    placeCaret('aa')
    await waitFor(() => expect(onFocus).toHaveBeenCalledTimes(2))
  })

  it('フォーカスのある ⋮⋮ が消えても、外へ出たときに onBlur を呼び、戻ったときにまた onFocus を呼ぶ', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const ui = (readOnly: boolean) => (
      <>
        <RichTextEditor
          {...DEFAULT_PROPS}
          readOnly={readOnly}
          aria-label="本文"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button type="button">外</button>
      </>
    )
    const { rerender } = render(ui(false), { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')
    pressLeft()
    expect(getGrip()).toHaveFocus()
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    rerender(ui(true))
    expect(screen.queryByTitle(HANDLE_TITLE)).not.toBeInTheDocument()

    act(() => screen.getByRole('button', { name: '外' }).focus())
    await waitFor(() => expect(onBlur).toHaveBeenCalledTimes(1))

    rerender(ui(false))
    placeCaret('aa')
    await waitFor(() => expect(onFocus).toHaveBeenCalledTimes(2))
  })

  it('ウィンドウを切り替えると onBlur を呼ぶ', async () => {
    const onBlur = vi.fn()
    render(<RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onBlur={onBlur} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')

    vi.spyOn(document, 'hasFocus').mockReturnValue(false)
    fireEvent.focusOut(getEditorDom())

    await waitFor(() => expect(onBlur).toHaveBeenCalledTimes(1))
  })

  it('メニューにフォーカスがあるときにエディタの枠の中を押しても、onBlur を呼ばない', async () => {
    // jsdom の hasFocus は何にもフォーカスが無いと false を返し、ウィンドウにフォーカスがあるかを返すブラウザと食い違う
    vi.spyOn(document, 'hasFocus').mockReturnValue(true)
    const onBlur = vi.fn()
    render(<RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onBlur={onBlur} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')
    await openMenuByKey()

    fireEvent.mouseDown(getEditorDom())
    await waitFor(() => expect(queryMenu()).not.toBeInTheDocument())
    placeCaret('aa')
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    expect(onBlur).not.toHaveBeenCalled()
  })

  it('支援技術のようにマウスを介さず ⋮⋮ を押しても開き、閉じると ⋮⋮ へ戻る', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('aa')
    await hoverBlock(1)
    await user.click(getGrip())
    await waitFor(() => expect(queryMenu()).toBeInTheDocument())
    await user.click(getGrip())
    await waitFor(() => expect(queryMenu()).not.toBeInTheDocument())
    await hoverBlock(1)

    fireEvent.click(getGrip(), { detail: 0 })
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })

    await waitFor(() => expect(getGrip()).toHaveFocus())
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')
  })

  it('マウスで押してフォーカスの付いた ⋮⋮ で、修飾キーだけや効かないショートカットを押してもキャレットを動かさない', async () => {
    await renderEditor()
    placeCaret('aa', 1)
    await hoverBlock(1)
    act(() => getGrip().focus())

    fireEvent.keyDown(getGrip(), { key: 'Meta', metaKey: true })
    fireEvent.keyDown(getGrip(), { key: 'c', metaKey: true })
    fireEvent.keyDown(getGrip(), { key: 'F9', altKey: true })

    expect(caret()).toEqual(['aa', 1])
  })

  it('キーボードで ⋮⋮ にいる間だけ、枠を描く印を付ける', async () => {
    await renderEditor()
    placeCaret('bb')
    await nextFrame()
    expect(getGrip()).not.toHaveAttribute('data-keyboard-focus')

    pressLeft()
    expect(getGrip()).toHaveAttribute('data-keyboard-focus')

    pressOnGrip('ArrowRight')
    await nextFrame()
    expect(getGrip()).not.toHaveAttribute('data-keyboard-focus')
  })

  it('⋮⋮ で Ctrl+/ を押すと、Enter と同じく開き、閉じると ⋮⋮ へ戻る', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()

    fireEvent.keyDown(getGrip(), { key: '/', ctrlKey: true })
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    expect(getGrip()).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })

    await waitFor(() => expect(getGrip()).toHaveFocus())
  })

  it('外のボタンを押すと、そのボタンの click より先に onBlur を呼ぶ', async () => {
    const onBlur = vi.fn()
    const blurCallsAtClick: number[] = []
    render(
      <>
        <RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onBlur={onBlur} />
        <button type="button" onClick={() => blurCallsAtClick.push(onBlur.mock.calls.length)}>
          外
        </button>
      </>,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    const button = screen.getByRole('button', { name: '外' })

    act(() => {
      fireEvent.mouseDown(button)
      button.focus()
      fireEvent.click(button)
    })

    expect(blurCallsAtClick).toEqual([1])
  })

  it('ボタンを押してもフォーカスを移さないブラウザで、ツールバーやメニューを押してフォーカスが body に落ちても onBlur を呼ばず、外を押すと呼ぶ', async () => {
    // jsdom の hasFocus は何にもフォーカスが無いと false を返し、ウィンドウにフォーカスがあるかを返すブラウザと食い違う
    vi.spyOn(document, 'hasFocus').mockReturnValue(true)
    const onBlur = vi.fn()
    render(<RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onBlur={onBlur} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    const toolbarButton = within(screen.getByRole('toolbar')).getAllByRole('button')[0]

    act(() => {
      fireEvent.mouseDown(toolbarButton)
      getEditorDom().blur()
      fireEvent.click(toolbarButton)
    })
    placeCaret('bb')
    await openMenuByKey()
    act(() => {
      fireEvent.mouseDown(getMenuItem('複製'))
      ;(document.activeElement as HTMLElement).blur()
    })
    await act(() => new Promise((resolve) => setTimeout(resolve)))
    expect(onBlur).not.toHaveBeenCalled()

    fireEvent.mouseDown(document.body)
    await waitFor(() => expect(onBlur).toHaveBeenCalledTimes(1))
  })

  it('Shadow DOM の中でも、← で ⋮⋮ へ移ってフォーカスが残り、onBlur を呼ばない', async () => {
    const onBlur = vi.fn()
    const host = document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    const container = document.createElement('div')

    // ProseMirror は jsdom を Safari と見なし（navigator.vendor が Apple）、Shadow DOM では jsdom に無い execCommand で選択を読む
    Object.assign(document, { execCommand: () => false })
    onTestFinished(() => {
      Reflect.deleteProperty(document, 'execCommand')
    })
    document.body.appendChild(host)
    shadow.appendChild(container)
    onTestFinished(() => host.remove())
    render(<RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onBlur={onBlur} />, {
      container,
      wrapper: Wrapper,
    })

    const editorDom = await waitFor(() => within(container).getByRole('textbox', { name: '本文' }))
    const editor = (editorDom as TiptapEditorHTMLElement).editor!
    let pos = -1

    editor.state.doc.descendants((node, offset) => {
      if (pos === -1 && node.isText && node.text === 'bb') pos = offset
    })
    act(() => {
      editor.commands.setTextSelection(pos)
      editor.view.focus()
    })
    fireEvent.keyDown(editorDom, { key: 'ArrowLeft' })
    await nextFrame()
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    expect(shadow.activeElement).toBe(within(container).getByTitle(HANDLE_TITLE))
    expect(onBlur).not.toHaveBeenCalled()
  })

  it('⋮⋮ にいる間にウィンドウを切り替えても、⋮⋮ は消えずフォーカスも残る', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()

    fireEvent.focusOut(getGrip())
    await hoverBlock(0)

    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')
  })

  it('マウスで押してフォーカスの付いた ⋮⋮ は、ポインタが外れても消さない', async () => {
    await renderEditor()
    placeCaret('aa')
    await hoverBlock(1)
    act(() => getGrip().focus())

    fireEvent.mouseLeave(getEditorDom().closest('.smarthr-ui-RichTextEditor')!)
    await nextFrame()

    expect(getGrip()).toHaveFocus()
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')
  })

  it('⋮⋮ から開いたメニューで下へ移動すると、動かしたブロックの ⋮⋮ にフォーカスを残す', async () => {
    await renderEditor()
    placeCaret('bb')
    pressLeft()
    pressOnGrip(' ')
    await waitFor(() => expect(queryMenu()).toBeInTheDocument())

    fireEvent.click(getMenuItem('下へ移動'))
    expect(outline()).toEqual(['aa', 'cc', 'bb'])

    await nextFrame()
    expect(getGrip()).toHaveFocus()
    expect(caret()).toEqual(['bb', 0])
    await waitFor(() => expect(announcement()).toMatch('「bb」'))
  })

  it('hideToolbar では ← を奪わない', async () => {
    await renderEditor({ hideToolbar: true })
    placeCaret('bb')

    expect(pressLeft()).toBe(true)
    expect(getEditorDom()).toHaveFocus()
  })

  it('⋮⋮ やメニューへ移っても onFocus・onBlur を呼ばず、エディタの外へ出たときに onBlur を 1 回呼ぶ', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    render(
      <>
        <RichTextEditor {...DEFAULT_PROPS} aria-label="本文" onFocus={onFocus} onBlur={onBlur} />
        <button type="button">外</button>
      </>,
      { wrapper: Wrapper },
    )
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    placeCaret('bb')
    await waitFor(() => expect(onFocus).toHaveBeenCalledTimes(1))

    pressLeft()
    pressOnGrip('Enter')
    await waitFor(() => expect(getConversionItem('標準テキスト')).toHaveFocus())
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await waitFor(() => expect(getGrip()).toHaveFocus())
    pressOnGrip('ArrowRight')
    await act(() => new Promise((resolve) => setTimeout(resolve)))

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).not.toHaveBeenCalled()

    act(() => screen.getByRole('button', { name: '外' }).focus())
    await waitFor(() => expect(onBlur).toHaveBeenCalledTimes(1))
    expect(onFocus).toHaveBeenCalledTimes(1)
  })
})

describe('つまみのドラッグ', () => {
  // ProseMirror 標準のドロップカーソルが posAtCoords で document.elementFromPoint を呼ぶが、jsdom には無い
  beforeEach(() => {
    document.elementFromPoint = vi.fn(() => null)
  })

  afterEach(() => {
    Reflect.deleteProperty(document, 'elementFromPoint')
  })

  // jsdom に DragEvent が無く、testing-library は素の Event で作るため clientY を渡せない
  const fireDragAt = (type: 'dragOver' | 'drop', y: number, types: string[]) => {
    const event = createEvent[type](getEditorDom(), { dataTransfer: { types, dropEffect: 'none' } })

    Object.defineProperty(event, 'clientY', { value: y })

    return fireEvent(getEditorDom(), event)
  }
  const dropAt = (y: number, types: string[]) => fireDragAt('drop', y, types)

  const startDrag = async (index: number) => {
    await hoverBlock(index)
    const grip = screen.getByTitle(HANDLE_TITLE)

    fireEvent.dragStart(grip, {
      dataTransfer: { setData: vi.fn(), setDragImage: vi.fn(), effectAllowed: 'all', types: [] },
    })

    return grip
  }

  it('ドラッグを取り消すと、⋮⋮ にフォーカスを残さず本文へ戻す', async () => {
    await renderEditor()
    placeCaret('aa')
    const grip = await startDrag(1)

    act(() => grip.focus())
    fireEvent.dragEnd(grip)

    expect(getEditorDom()).toHaveFocus()
  })

  it('最上位の境界に落とすとそこへ動かし、features に無い書式も残す。1 回の取り消しで戻る', async () => {
    await renderEditor({
      features: ['blockActions'],
      defaultValue: doc([
        paragraph('aa'),
        paragraph('bb'),
        { type: 'paragraph', content: [{ type: 'text', text: 'cc', marks: [{ type: 'bold' }] }] },
      ]),
    })
    const grip = await startDrag(2)

    expect(fireDragAt('dragOver', 5, [BLOCK_DRAG_TYPE])).toBe(false)
    expect(dropAt(5, [BLOCK_DRAG_TYPE])).toBe(false)
    fireEvent.dragEnd(grip)

    expect(outline()).toEqual(['cc', 'aa', 'bb'])
    expect(
      getEditor().state.doc.firstChild?.firstChild?.marks.map(({ type }) => type.name),
    ).toEqual(['bold'])
    expect(getEditorDom()).toHaveFocus()
    expect(getEditor().state.selection.$head.parent.textContent).toBe('cc')

    act(() => {
      getEditor().commands.undo()
    })
    expect(outline()).toEqual(['aa', 'bb', 'cc'])
  })

  it('掴んだブロックの上下の境界に落としても動かさない', async () => {
    await renderEditor()
    await startDrag(1)

    dropAt(45, [BLOCK_DRAG_TYPE])

    expect(outline()).toEqual(['aa', 'bb', 'cc'])
  })

  it('ほかから持ち込んだドラッグは ProseMirror に任せる', async () => {
    await renderEditor()
    await startDrag(1)

    expect(dropAt(5, ['text/plain'])).toBe(true)

    expect(outline()).toEqual(['aa', 'bb', 'cc'])
  })

  it('このエディタで掴んでいないブロックの型は受け取らない', async () => {
    await renderEditor()

    expect(dropAt(5, [BLOCK_DRAG_TYPE])).toBe(true)

    expect(outline()).toEqual(['aa', 'bb', 'cc'])
  })

  it('本文の中から始めたドラッグの dragend が届かなくても、つまみは乗せたブロックへ動く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    await hoverBlock(0)

    fireEvent.dragStart(getEditor().view.nodeDOM(0) as HTMLElement, {
      dataTransfer: { files: [], clearData: vi.fn(), setData: vi.fn(), types: [] },
    })
    dropAt(85, ['text/html', 'text/plain'])

    await hoverBlock(2)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await user.click(await screen.findByRole('menuitem', { name: '削除' }))

    expect(outline()).toEqual(['aa', 'bb'])
  })

  it('掴んだまま つまみが消えると、ドラッグの印を残さず、あとで落としたブロックの型も受け取らない', async () => {
    const { rerender } = await renderEditor()
    await startDrag(1)
    expect(getEditorDom().closest('[data-block-dragging]')).not.toBeNull()

    rerender({ readOnly: true })

    expect(getEditorDom().closest('[data-block-dragging]')).toBeNull()

    rerender({ readOnly: false })

    expect(dropAt(5, [BLOCK_DRAG_TYPE])).toBe(true)
    expect(outline()).toEqual(['aa', 'bb', 'cc'])
  })
})

describe('エディタの作り直し', () => {
  it('Activity で隠してエディタが作り直されても、表示し直すとブロックの操作とスラッシュメニューが新しいエディタで動く', async () => {
    const ui = (mode: 'visible' | 'hidden') => (
      <Activity mode={mode}>
        <RichTextEditor
          defaultValue={doc([paragraph('aa'), paragraph('bb'), paragraph()])}
          features={[...FEATURES, 'slashCommand']}
          aria-label="本文"
          onImageUpload={vi.fn()}
        />
      </Activity>
    )
    const { rerender } = render(ui('visible'), { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    const before = getEditor()

    rerender(ui('hidden'))
    await waitFor(() => expect(before.isDestroyed).toBe(true))
    rerender(ui('visible'))
    await waitFor(() => expect(getEditor()).not.toBe(before))

    placeCaret('aa')
    await openMenuByKey()
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
    await waitFor(() => expect(queryMenu()).not.toBeInTheDocument())

    pressMove('ArrowDown')
    expect(outline()).toEqual(['bb', 'aa', 'paragraph'])
    await waitFor(() => expect(announcement()).toMatch('「aa」'))

    await hoverBlock(0)
    expect(getGrip()).toHaveAccessibleName('段落「bb」の操作')
    fireEvent.keyDown(getEditorDom(), { key: 'a' })
    await nextFrame()
    expect(getGrip()).toHaveAccessibleName('段落「aa」の操作')

    const editor = getEditor()

    act(() => {
      editor.commands.setTextSelection(editor.state.doc.content.size - 1)
      editor.view.focus()
    })
    act(() => {
      const { from, to } = editor.state.selection
      const insert = () => editor.state.tr.insertText('/', from, to)

      if (!editor.view.someProp('handleTextInput', (f) => f(editor.view, from, to, '/', insert))) {
        editor.view.dispatch(insert())
      }
    })
    const listbox = await screen.findByRole('listbox', { name: 'ブロックと色' })
    const options = () => within(listbox).getAllByRole('option')

    expect(options().some((option) => option.textContent?.includes('画像を挿入'))).toBe(true)
    expect(options()[0]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(getEditorDom(), { key: 'ArrowDown' })

    await waitFor(() => expect(options()[1]).toHaveAttribute('aria-selected', 'true'))
  })
})
