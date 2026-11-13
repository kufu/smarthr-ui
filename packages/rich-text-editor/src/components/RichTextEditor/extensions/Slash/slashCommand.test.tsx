import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { RichTextFeature, RichTextJSON, RichTextVideo } from '../../types'
import type { Editor, JSONContent, TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>{children}</EnvironmentProvider>
  </IntlProvider>
)

const TEXT_FEATURES: RichTextFeature[] = [
  'slashCommand',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'table',
]

const MEDIA_FEATURES: RichTextFeature[] = ['slashCommand', 'image', 'youtube', 'video']

const VIDEOS: RichTextVideo[] = [{ src: '/a.mp4', title: 'サンプル動画' }]

type EditorProps = {
  features?: RichTextFeature[]
  headingLevels?: ReadonlyArray<1 | 2 | 3 | 4>
  defaultValue?: RichTextJSON
  hideToolbar?: boolean
  readOnly?: boolean
  disabled?: boolean
  withMediaCallbacks?: boolean
}

const COLOR_FEATURES: RichTextFeature[] = ['slashCommand', 'color', 'backgroundColor']

const COLOR_NAMES = ['グレー', '赤', 'オレンジ', '黄', '緑', '水色', '青', '紫']

const getEditorDom = () => screen.getByRole('textbox', { name: '本文' })
const getEditor = (): Editor => (getEditorDom() as TiptapEditorHTMLElement).editor!
const queryMenu = () => screen.queryByRole('listbox', { name: 'ブロックと色' })
const withinMenu = () => within(screen.getByRole('listbox', { name: 'ブロックと色' }))
const getOptionNames = () =>
  withinMenu()
    .getAllByRole('option')
    .map((option) => option.textContent)
const getSelectedOption = () => withinMenu().getByRole('option', { selected: true })

const renderEditor = async ({
  features = TEXT_FEATURES,
  withMediaCallbacks = false,
  ...rest
}: EditorProps = {}) => {
  const onChange = vi.fn<(json: RichTextJSON) => void>()

  render(
    <RichTextEditor
      {...rest}
      features={features}
      loadVideos={withMediaCallbacks ? vi.fn(async () => VIDEOS) : undefined}
      aria-label="本文"
      onChange={onChange}
      onImageUpload={withMediaCallbacks ? vi.fn() : undefined}
    />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

  return { lastJSON: () => onChange.mock.lastCall![0] }
}

const placeCaret = (findPos: (doc: Editor['state']['doc']) => number) => {
  const editor = getEditor()

  act(() => {
    editor.commands.setTextSelection(findPos(editor.state.doc))
    editor.view.focus()
  })
}

const inFirstEmptyTextblock = (doc: Editor['state']['doc']) => {
  let found: number | null = null

  doc.descendants((node, pos) => {
    if (found !== null) return false
    if (node.isTextblock && node.content.size === 0) found = pos + 1

    return true
  })

  return found!
}

const afterText = (text: string) => (doc: Editor['state']['doc']) => {
  let found: number | null = null

  doc.descendants((node, pos) => {
    const index = node.isText ? (node.text ?? '').indexOf(text) : -1

    if (found === null && index !== -1) found = pos + index + text.length
  })

  return found!
}

// user.type を使わないのは、jsdom の contenteditable では文字入力を再現できないため
const typeText = (text: string) => {
  const editor = getEditor()

  act(() => {
    const { from, to } = editor.state.selection
    const insert = () => editor.state.tr.insertText(text, from, to)
    const handled = editor.view.someProp('handleTextInput', (handler) =>
      handler(editor.view, from, to, text, insert),
    )

    if (!handled) editor.view.dispatch(insert())
  })
}

const openMenu = (query = '') => {
  placeCaret(inFirstEmptyTextblock)
  typeText(`/${query}`)
  expect(queryMenu()).toBeInTheDocument()
}

const recordKeysReachingDocument = () => {
  const keys: string[] = []
  const listener = (e: KeyboardEvent) => keys.push(e.key)

  document.addEventListener('keydown', listener)
  onTestFinished(() => document.removeEventListener('keydown', listener))

  return keys
}

const doc = (content: JSONContent[]): RichTextJSON => ({ type: 'doc', content })
const blocks = (json: RichTextJSON) =>
  json.content?.map((node) => [node.type, node.content?.map(({ text }) => text).join('') ?? ''])
const paragraph = (text?: string): JSONContent =>
  text ? { type: 'paragraph', content: [{ type: 'text', text }] } : { type: 'paragraph' }

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('スラッシュコマンドを開く場所', () => {
  it.each(['/', '／'])('最上位の空の段落で %s を打つと開く', async (char) => {
    await renderEditor()
    placeCaret(inFirstEmptyTextblock)

    typeText(char)

    expect(getOptionNames()).toContain('見出し1')
  })

  it.each<{ name: string; content: RichTextJSON; caret: (d: Editor['state']['doc']) => number }>([
    {
      name: '見出し',
      content: doc([{ type: 'heading', attrs: { level: 2 } }]),
      caret: inFirstEmptyTextblock,
    },
    {
      name: '箇条書きの項目',
      content: doc([
        { type: 'bulletList', content: [{ type: 'listItem', content: [paragraph()] }] },
      ]),
      caret: inFirstEmptyTextblock,
    },
    {
      name: '引用',
      content: doc([{ type: 'blockquote', content: [paragraph()] }]),
      caret: inFirstEmptyTextblock,
    },
    {
      name: '表のセル',
      content: doc([
        {
          type: 'table',
          content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [paragraph()] }] }],
        },
      ]),
      caret: inFirstEmptyTextblock,
    },
    {
      name: 'コードブロック',
      content: doc([{ type: 'codeBlock' }]),
      caret: inFirstEmptyTextblock,
    },
    { name: '文の末尾', content: doc([paragraph('あいう')]), caret: afterText('あいう') },
    { name: '文の途中', content: doc([paragraph('あいう')]), caret: afterText('あ') },
    { name: '文の先頭', content: doc([paragraph('あいう')]), caret: () => 1 },
  ])('$name では開かない', async ({ content, caret }) => {
    await renderEditor({ defaultValue: content })
    placeCaret(caret)

    typeText('/')

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('インラインコードの中では開かない', async () => {
    await renderEditor({ features: [...TEXT_FEATURES, 'code'] })
    placeCaret(inFirstEmptyTextblock)
    act(() => {
      getEditor().commands.toggleCode()
    })

    typeText('/')

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('・では開かない', async () => {
    await renderEditor()
    placeCaret(inFirstEmptyTextblock)

    typeText('・')

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it.each<[string, EditorProps]>([
    ['hideToolbar', { hideToolbar: true }],
    ['readOnly', { readOnly: true }],
    ['disabled', { disabled: true }],
  ])('%s では開かない', async (_, props) => {
    await renderEditor(props)
    placeCaret(inFirstEmptyTextblock)

    typeText('/')

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('features に slashCommand が無ければ開かない', async () => {
    await renderEditor({ features: ['heading'] })
    placeCaret(inFirstEmptyTextblock)

    typeText('/')

    expect(queryMenu()).not.toBeInTheDocument()
  })
})

describe('スラッシュコマンドのキー操作', () => {
  it('↓↑で選択が移り、本文の aria-activedescendant が選択中の項目を指す', async () => {
    const user = userEvent.setup()
    await renderEditor()
    openMenu()

    expect(getSelectedOption()).toHaveTextContent('見出し1')
    expect(getEditorDom()).toHaveAttribute('aria-activedescendant', getSelectedOption().id)
    expect(getEditorDom()).toHaveAttribute('aria-autocomplete', 'list')
    expect(getEditorDom()).toHaveAttribute(
      'aria-controls',
      screen.getByRole('listbox', { name: 'ブロックと色' }).id,
    )

    await user.keyboard('{ArrowDown}')

    expect(getSelectedOption()).toHaveTextContent('見出し2')
    expect(getEditorDom()).toHaveAttribute('aria-activedescendant', getSelectedOption().id)

    await user.keyboard('{ArrowUp}{ArrowUp}')

    expect(getSelectedOption()).toHaveTextContent('表を挿入')
  })

  it('Enter で今の空の段落を選択中のブロックに置き換える', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor()
    openMenu()

    await user.keyboard('{ArrowDown}{Enter}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(lastJSON().content?.[0]).toMatchObject({ type: 'heading', attrs: { level: 2 } })
    expect(lastJSON().content?.[0].content).toBeUndefined()
  })

  it('Esc で閉じ、打った文字は残し、本文の aria 属性を外す', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor()
    openMenu('みだし')

    await user.keyboard('{Escape}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(blocks(lastJSON())).toEqual([['paragraph', '/みだし']])
    expect(getEditorDom()).not.toHaveAttribute('aria-activedescendant')
    expect(getEditorDom()).not.toHaveAttribute('aria-controls')
    expect(getEditorDom()).not.toHaveAttribute('aria-autocomplete')
  })

  it('Esc で閉じたあとは、続けて打っても開き直らない', async () => {
    const user = userEvent.setup()
    await renderEditor()
    openMenu()

    await user.keyboard('{Escape}')
    typeText('みだし')

    expect(queryMenu()).not.toBeInTheDocument()
  })

  it('開いている間の Esc はメニューを閉じるだけで、document まで届かない', async () => {
    const user = userEvent.setup()
    await renderEditor()
    openMenu()
    const keys = recordKeysReachingDocument()

    await user.keyboard('{Escape}')

    expect(queryMenu()).not.toBeInTheDocument()
    expect(keys).toEqual([])
  })

  it('閉じている間の Esc は document まで届く', async () => {
    const user = userEvent.setup()
    await renderEditor()
    placeCaret(inFirstEmptyTextblock)
    const keys = recordKeysReachingDocument()

    await user.keyboard('{Escape}')

    expect(keys).toEqual(['Escape'])
  })

  it('マウスを乗せた項目を選択中にし、本文の aria-activedescendant も移す', async () => {
    const user = userEvent.setup()
    await renderEditor()
    openMenu()

    await user.hover(screen.getByRole('option', { name: '引用' }))

    expect(getSelectedOption()).toHaveTextContent('引用')
    expect(getEditorDom()).toHaveAttribute('aria-activedescendant', getSelectedOption().id)
  })

  it('↑↓ で一覧がスクロールしてポインタの下の項目が替わっても、マウスを動かさなければ選択中は移らない', async () => {
    const user = userEvent.setup()
    await renderEditor()
    openMenu()

    await user.keyboard('{ArrowDown}')
    fireEvent.mouseOver(screen.getByRole('option', { name: '引用' }))

    expect(getSelectedOption()).toHaveTextContent('見出し2')
  })

  it('IME の変換中は ↑↓ と Enter を奪わない', async () => {
    const { lastJSON } = await renderEditor()
    openMenu()
    const editorDom = getEditorDom()

    fireEvent.compositionStart(editorDom)
    fireEvent.keyDown(editorDom, { key: 'ArrowDown', isComposing: true })
    fireEvent.keyDown(editorDom, { key: 'Enter', isComposing: true })
    fireEvent.compositionEnd(editorDom)

    expect(getSelectedOption()).toHaveTextContent('見出し1')
    expect(blocks(lastJSON())).toEqual([['paragraph', '/']])
  })

  it('変換中を示すキー入力は、エディタが変換中と見なしていなくても奪わない', async () => {
    const { lastJSON } = await renderEditor()
    openMenu()

    fireEvent.keyDown(getEditorDom(), { key: 'ArrowDown', isComposing: true })
    expect(getSelectedOption()).toHaveTextContent('見出し1')

    fireEvent.keyDown(getEditorDom(), { key: 'Enter', isComposing: true })
    expect(lastJSON().content?.every((node) => node.type === 'paragraph')).toBe(true)
  })
})

describe('スラッシュコマンドの項目', () => {
  it('打った語で絞り込み、該当が無ければ本文の aria-activedescendant で知らせを指し、Enter は改行のまま', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor()
    openMenu('みだし')

    expect(getOptionNames()).toEqual(['見出し1', '見出し2', '見出し3', '見出し4'])

    typeText('zzz')

    const activeId = getEditorDom().getAttribute('aria-activedescendant')
    const noMatch = activeId ? document.getElementById(activeId) : null

    expect(noMatch).toHaveTextContent('該当する項目がありません。')
    expect(noMatch).toHaveAttribute('aria-disabled', 'true')

    await user.keyboard('{Enter}')

    expect(blocks(lastJSON())).toEqual([
      ['paragraph', '/みだしzzz'],
      ['paragraph', ''],
    ])
  })

  it('features と headingLevels を変えると、開いたまま項目が追従する', async () => {
    const Host = () => {
      const [next, setNext] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setNext(true)}>
            変更
          </button>
          <RichTextEditor
            features={
              next
                ? ['slashCommand', 'heading', 'orderedList', 'table']
                : ['slashCommand', 'heading', 'bulletList']
            }
            headingLevels={next ? [3] : [1, 2]}
            aria-label="本文"
          />
        </>
      )
    }
    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    openMenu()

    expect(getOptionNames()).toEqual(['見出し1', '見出し2', '箇条書きリスト'])

    fireEvent.click(screen.getByRole('button', { name: '変更' }))

    expect(getOptionNames()).toEqual(['見出し3', '番号付きリスト', '表を挿入'])
  })

  it('クリックで選んでも本文のフォーカスは動かない', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor()
    openMenu()

    await user.click(screen.getByRole('option', { name: '引用' }))

    expect(lastJSON().content?.[0]).toMatchObject({ type: 'blockquote' })
    expect(getEditorDom()).toHaveFocus()
  })

  it('「メニューを閉じる」を押すと、打った文字を残して閉じ、本文のフォーカスは動かない', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor()
    openMenu('みだし')
    const closeButton = screen.getByRole('button', { name: 'メニューを閉じる' })

    expect(closeButton).toHaveAttribute('aria-keyshortcuts', 'Escape')
    expect(closeButton).toHaveTextContent('esc')

    await user.click(closeButton)

    expect(queryMenu()).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'メニューを閉じる' })).not.toBeInTheDocument()
    expect(blocks(lastJSON())).toEqual([['paragraph', '/みだし']])
    expect(getEditorDom()).toHaveFocus()
  })

  it('該当が無いときも「メニューを閉じる」を出す', async () => {
    await renderEditor()
    openMenu()

    typeText('zzz')

    expect(await screen.findByText('該当する項目がありません。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'メニューを閉じる' })).toBeInTheDocument()
  })

  it('表は 3 行 3 列でヘッダー行付きのものが入る', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor()
    openMenu('表')

    await user.keyboard('{Enter}')

    const table = lastJSON().content?.find((node) => node.type === 'table')
    expect(table?.content?.map((row) => row.content?.map((cell) => cell.type))).toEqual([
      ['tableHeader', 'tableHeader', 'tableHeader'],
      ['tableCell', 'tableCell', 'tableCell'],
      ['tableCell', 'tableCell', 'tableCell'],
    ])
  })
})

describe('本文からフォーカスが外れたとき', () => {
  it('メニューを隠し、本文の aria 属性を外す', async () => {
    await renderEditor()
    openMenu()

    act(() => getEditorDom().blur())

    expect(queryMenu()).not.toBeInTheDocument()
    expect(getEditorDom()).not.toHaveAttribute('aria-activedescendant')
    expect(getEditorDom()).not.toHaveAttribute('aria-controls')
    expect(getEditorDom()).not.toHaveAttribute('aria-autocomplete')
  })

  it('本文に戻って 1 文字打つと、打った語で絞り込んで開く', async () => {
    await renderEditor()
    openMenu()
    act(() => getEditorDom().blur())

    placeCaret(afterText('/'))
    typeText('表')

    expect(getOptionNames()).toEqual(['表を挿入'])
  })
})

describe('ダイアログで入れるブロック', () => {
  it.each([
    { query: 'image', role: 'menu', name: '画像を挿入' },
    { query: 'youtube', role: 'dialog', name: 'YouTube動画を埋め込む' },
    { query: 'video', role: 'dialog', name: '動画を挿入' },
  ] as const)(
    '$name を選ぶとツールバーと同じポップアップが開き、Esc で本文へ戻る',
    async ({ query, role, name }) => {
      const user = userEvent.setup()
      const { lastJSON } = await renderEditor({
        features: MEDIA_FEATURES,
        withMediaCallbacks: true,
      })
      openMenu(query)

      expect(getOptionNames()).toEqual([name])

      await user.keyboard('{Enter}')

      const popup = screen.getByRole(role, { name })
      expect(blocks(lastJSON())).toEqual([['paragraph', '']])
      await waitFor(() => expect(popup).toContainElement(document.activeElement as HTMLElement))

      await user.keyboard('{Escape}')

      expect(screen.queryByRole(role, { name })).not.toBeInTheDocument()
      expect(getEditorDom()).toHaveFocus()
    },
  )

  it('YouTube は / を打った段落の位置に入る', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor({
      features: MEDIA_FEATURES,
      withMediaCallbacks: true,
      defaultValue: doc([paragraph('まえ'), paragraph(), paragraph('あと')]),
    })
    openMenu('youtube')
    await user.keyboard('{Enter}')
    const input = await screen.findByRole('textbox', { name: /YouTube URL/ })
    await waitFor(() => expect(input).toHaveFocus())

    await user.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ{Enter}')

    expect(lastJSON().content?.map((node) => node.type)).toEqual([
      'paragraph',
      'youtube',
      'paragraph',
    ])
  })

  it('一度閉じたあと、画像を選んだまま / を打っても、メディアの項目が並ぶ', async () => {
    const user = userEvent.setup()
    await renderEditor({
      features: MEDIA_FEATURES,
      withMediaCallbacks: true,
      defaultValue: doc([
        paragraph(),
        { type: 'image', attrs: { src: 'https://example.com/a.png', alt: '' } },
      ]),
    })
    // 初めて開く場面で確かめないのは、位置が決まる描き直しで項目が作り直され、欠けが隠れるため
    openMenu()
    await user.keyboard('{Escape}')
    const editor = getEditor()
    act(() => {
      editor.commands.setNodeSelection(editor.state.doc.child(0).nodeSize)
      editor.view.focus()
    })

    // typeText を使わないのは、ノード選択中の打鍵は keypress から入り、キャレットを打った文字の後ろに置くため
    fireEvent.keyPress(getEditorDom(), { key: '/', charCode: '/'.charCodeAt(0) })

    expect(getOptionNames()).toEqual(['画像を挿入', 'YouTube動画を埋め込む', '動画を挿入'])
  })

  it('挿入ボタンが消えて開けなくなった項目では、Enter は改行のまま', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn<(json: RichTextJSON) => void>()
    const loadVideos = vi.fn(async () => VIDEOS)
    const Host = () => {
      const [withVideos, setWithVideos] = useState(true)

      return (
        <>
          <button type="button" onClick={() => setWithVideos(false)}>
            動画を外す
          </button>
          <RichTextEditor
            features={MEDIA_FEATURES}
            loadVideos={withVideos ? loadVideos : undefined}
            aria-label="本文"
            onChange={onChange}
          />
        </>
      )
    }
    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())
    openMenu('video')

    fireEvent.click(screen.getByRole('button', { name: '動画を外す' }))
    await user.keyboard('{Enter}')

    expect(blocks(onChange.mock.lastCall![0])).toEqual([
      ['paragraph', '/video'],
      ['paragraph', ''],
    ])
  })

  it('loadVideos が無ければ、動画はツールバーと同じく並ばない', async () => {
    await renderEditor({ features: MEDIA_FEATURES })
    openMenu()

    expect(getOptionNames()).toEqual(['画像を挿入', 'YouTube動画を埋め込む'])
  })
})

describe('色の項目', () => {
  it.each([
    {
      feature: 'color',
      group: '文字色',
      other: '背景色',
      names: ['黒', ...COLOR_NAMES, '文字色をリセット'],
    },
    {
      feature: 'backgroundColor',
      group: '背景色',
      other: '文字色',
      names: [...COLOR_NAMES, '背景色をリセット'],
    },
  ] as const)(
    'features に $feature があるときだけ「$group」のグループが並ぶ',
    async ({ feature, group, other, names }) => {
      await renderEditor({ features: ['slashCommand', 'heading', feature] })
      openMenu()

      expect(withinMenu().queryByRole('group', { name: other })).not.toBeInTheDocument()
      expect(
        within(withinMenu().getByRole('group', { name: group }))
          .getAllByRole('option')
          .map((option) => option.textContent),
      ).toEqual(names)
    },
  )

  it('色の名前を見せ、グループ名を付けて読み上げる。打った語は文字色と背景色の両方に当てる', async () => {
    await renderEditor({ features: [...TEXT_FEATURES, ...COLOR_FEATURES] })
    openMenu('あか')

    const options = withinMenu().getAllByRole('option')

    expect(options.map((option) => option.textContent)).toEqual(['赤', '赤'])
    expect(options[0]).toHaveAccessibleName('文字色: 赤')
    expect(options[1]).toHaveAccessibleName('背景色: 赤')
  })

  it('「/もじいろ」では文字色だけがすべて並ぶ', async () => {
    await renderEditor({ features: [...TEXT_FEATURES, ...COLOR_FEATURES] })
    openMenu('もじいろ')

    expect(withinMenu().getAllByRole('group')).toHaveLength(1)
    expect(
      within(withinMenu().getByRole('group', { name: '文字色' }))
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['黒', ...COLOR_NAMES, '文字色をリセット'])
  })

  it('リセットは文言をそのまま読み上げ、グループ名を重ねない', async () => {
    await renderEditor({ features: COLOR_FEATURES })
    openMenu('りせっと')

    const options = withinMenu().getAllByRole('option')

    expect(options.map((option) => option.textContent)).toEqual([
      '文字色をリセット',
      '背景色をリセット',
    ])
    expect(options[0]).toHaveAccessibleName('文字色をリセット')
    expect(options[1]).toHaveAccessibleName('背景色をリセット')
  })

  it.each([
    { option: '文字色: 赤', query: 'あか', keys: '{Enter}', attrs: { color: '#9e3b4e' } },
    {
      option: '背景色: 赤',
      query: 'あか',
      keys: '{ArrowDown}{Enter}',
      attrs: { backgroundColor: '#ffdfe2' },
    },
    { option: '文字色: 黒', query: 'くろ', keys: '{Enter}', attrs: { color: '#23221e' } },
  ])(
    '$option を選ぶと /$query を消し、続けて打つ文字にその色が付く',
    async ({ query, keys, attrs }) => {
      const user = userEvent.setup()
      const { lastJSON } = await renderEditor({ features: COLOR_FEATURES })
      openMenu(query)

      await user.keyboard(keys)
      typeText('あ')

      expect(queryMenu()).not.toBeInTheDocument()
      expect(blocks(lastJSON())).toEqual([['paragraph', 'あ']])
      expect(lastJSON().content?.[0].content?.[0].marks).toEqual([
        { type: 'textStyle', attrs: expect.objectContaining(attrs) },
      ])
    },
  )

  it.each([
    { color: '文字色: 赤', reset: '文字色をリセット', query: 'りせっと' },
    { color: '背景色: 赤', reset: '背景色をリセット', query: 'なし' },
  ])(
    '$color を選んだあとに $reset を選ぶと、続けて打つ文字に色が付かない',
    async ({ color, reset, query }) => {
      const user = userEvent.setup()
      const { lastJSON } = await renderEditor({ features: COLOR_FEATURES })
      openMenu('あか')
      await user.click(withinMenu().getByRole('option', { name: color }))
      typeText(`/${query}`)

      await user.click(withinMenu().getByRole('option', { name: reset }))
      typeText('あ')

      expect(blocks(lastJSON())).toEqual([['paragraph', 'あ']])
      expect(lastJSON().content?.[0].content?.[0].marks).toBeUndefined()
    },
  )

  it('文字色を選んだあとに背景色を選ぶと、続けて打つ文字に両方が付く', async () => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor({ features: COLOR_FEATURES })
    openMenu('あか')
    await user.click(withinMenu().getByRole('option', { name: '文字色: 赤' }))
    typeText('/きいろ')

    await user.click(withinMenu().getByRole('option', { name: '背景色: 黄' }))
    typeText('あ')

    expect(blocks(lastJSON())).toEqual([['paragraph', 'あ']])
    expect(lastJSON().content?.[0].content?.[0].marks).toEqual([
      {
        type: 'textStyle',
        attrs: expect.objectContaining({ color: '#9e3b4e', backgroundColor: '#f1e8ce' }),
      },
    ])
  })

  it.each([
    { reset: '文字色をリセット', kept: { color: null, backgroundColor: '#f1e8ce' } },
    { reset: '背景色をリセット', kept: { color: '#9e3b4e', backgroundColor: null } },
  ])('$reset は、もう一方の色と太字を残す', async ({ reset, kept }) => {
    const user = userEvent.setup()
    const { lastJSON } = await renderEditor({ features: [...COLOR_FEATURES, 'bold'] })
    placeCaret(inFirstEmptyTextblock)
    act(() => {
      getEditor().commands.toggleBold()
    })
    typeText('/あか')
    await user.click(withinMenu().getByRole('option', { name: '文字色: 赤' }))
    typeText('/きいろ')
    await user.click(withinMenu().getByRole('option', { name: '背景色: 黄' }))
    typeText('/りせっと')

    await user.click(withinMenu().getByRole('option', { name: reset }))
    typeText('あ')

    const marks = lastJSON().content?.[0].content?.[0].marks

    expect(blocks(lastJSON())).toEqual([['paragraph', 'あ']])
    expect(marks).toHaveLength(2)
    expect(marks).toEqual(
      expect.arrayContaining([
        { type: 'bold' },
        { type: 'textStyle', attrs: expect.objectContaining(kept) },
      ]),
    )
  })
})
