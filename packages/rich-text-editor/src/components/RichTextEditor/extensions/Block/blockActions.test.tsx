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
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import { BLOCK_DRAG_TYPE } from './BlockActions'

import type { RichTextFeature, RichTextJSON } from '../../types'
import type { Editor, JSONContent, TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

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
const getMenuItem = (name: string) =>
  within(screen.getByRole('menu', { name: 'ブロックの操作' })).getByRole('menuitem', { name })

const openMenuByKey = async () => {
  pressMenuKey()
  await waitFor(() => expect(queryMenu()).toBeInTheDocument())
  await waitFor(() => expect(document.activeElement?.getAttribute('role')).toBe('menuitem'))
}

const HANDLE_TITLE = 'ドラッグで移動、クリックでメニューを開く'

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
    await renderEditor()
    placeCaret('aa')

    await openMenuByKey()

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
    await renderEditor()
    placeCaret('bb')
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

describe('つまみ', () => {
  it('ブロックに乗せると ⋮⋮ を出し、クリックするとそのブロックを対象にブロックメニューを開く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret('aa')

    await hoverBlock(2)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(getMenuItem('上へ移動')).toHaveFocus())
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

  it('文字を打つと隠し、マウスを動かすとまた出す', async () => {
    await renderEditor()
    placeCaret('aa')
    await hoverBlock(1)

    fireEvent.keyDown(getEditorDom(), { key: 'a' })
    await nextFrame()
    expect(screen.queryByTitle(HANDLE_TITLE)).not.toBeInTheDocument()

    await hoverBlock(1)
    expect(screen.getByTitle(HANDLE_TITLE)).toBeInTheDocument()
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

  it('⋮⋮ で開いたメニューの間はポインタが外れてもつまみを出したままにし、閉じると隠す', async () => {
    const user = userEvent.setup()
    await renderEditor()
    await hoverBlock(1)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(getMenuItem('上へ移動')).toHaveFocus())

    await user.hover(getMenuItem('下へ移動'))
    await nextFrame()
    expect(screen.getByTitle(HANDLE_TITLE)).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await nextFrame()
    expect(queryMenu()).not.toBeInTheDocument()
    expect(screen.queryByTitle(HANDLE_TITLE)).not.toBeInTheDocument()
  })

  it('⋮⋮ で開いたメニューは、もう一度 ⋮⋮ を押すと閉じ、その次に押すとまた開く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    await hoverBlock(1)
    await user.click(screen.getByTitle(HANDLE_TITLE))
    await waitFor(() => expect(getMenuItem('上へ移動')).toHaveFocus())

    await user.click(screen.getByTitle(HANDLE_TITLE))
    await nextFrame()
    expect(queryMenu()).not.toBeInTheDocument()

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
