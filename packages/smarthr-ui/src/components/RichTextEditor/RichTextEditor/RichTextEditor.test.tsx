import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { IntlProvider } from '../../../intl'
import { FormControl } from '../../FormControl'

import { RichTextEditor } from './RichTextEditor'

import type { ExternalRichTextValue, RichTextEditorController, RichTextJSON } from '../types'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const ALL_FEATURES = [
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'codeBlock',
  'bulletList',
  'orderedList',
  'blockquote',
  'horizontalRule',
  'link',
  'heading',
  'color',
  'backgroundColor',
  'fontSize',
  'lineHeight',
  'textAlign',
  'image',
  'youtube',
  'table',
] as const

describe('RichTextEditor', () => {
  it('renders the editor', async () => {
    render(<RichTextEditor />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  it('renders toolbar when not readOnly', async () => {
    render(<RichTextEditor />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
  })

  it('hides toolbar when readOnly', async () => {
    render(<RichTextEditor readOnly />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
  })

  it('renders toolbar buttons based on features', async () => {
    render(<RichTextEditor features={['bold', 'italic']} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('太字')).toBeInTheDocument()
    expect(screen.getByLabelText('斜体')).toBeInTheDocument()
    expect(screen.queryByLabelText('箇条書きリスト')).not.toBeInTheDocument()
  })

  // NOTE: jsdomではcontenteditable divへのuserEvent.typeが動作しないため、
  // onChangeの動作テストはStorybookのインタラクションテストで行う

  it('renders with defaultValue', async () => {
    const defaultValue = {
      type: 'doc' as const,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Initial content' }],
        },
      ],
    }
    render(<RichTextEditor defaultValue={defaultValue} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('Initial content')).toBeInTheDocument()
    })
  })

  it('integrates with FormControl', async () => {
    render(
      <IntlProvider locale="ja">
        {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
        <FormControl label="Description" errorMessages="Required field">
          <RichTextEditor />
        </FormControl>
      </IntlProvider>,
    )
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('has aria-pressed on toggle buttons', async () => {
    render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    const boldButton = screen.getByLabelText('太字')
    expect(boldButton).toHaveAttribute('aria-pressed', 'false')
  })

  describe('ツールバーのグルーピング', () => {
    const SEPARATOR_SELECTOR = '.smarthr-ui-RichTextEditor-ToolbarSeparator'

    const getToolbarButtonLabels = () =>
      within(screen.getByRole('toolbar'))
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label'))

    const getSeparatorCount = () =>
      screen.getByRole('toolbar').querySelectorAll(SEPARATOR_SELECTOR).length

    it('機能グループの順に項目が並ぶ', async () => {
      render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })

      expect(getToolbarButtonLabels()).toEqual([
        // 履歴操作
        '元に戻す',
        'やり直す',
        // テキスト装飾
        '書式: 標準テキスト',
        'フォントサイズ: 16',
        '行送り: 1.75（標準）',
        '太字',
        '斜体',
        '下線',
        '打ち消し線',
        '文字色: 黒',
        '背景色: なし',
        'テキスト配置: 左揃え',
        // テキストの意味づけ
        'リンク',
        '箇条書きリスト',
        '番号付きリスト',
        '引用',
        'インラインコード',
        'コードブロック',
        // 挿入
        '水平線',
        'テーブルを挿入',
        '画像を挿入',
        'YouTube動画を埋め込む',
      ])
    })

    it('グループ間に区切り線を描画する', async () => {
      render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })

      // 4グループの間なので3本。先頭と末尾には付かない
      expect(getSeparatorCount()).toBe(3)
    })

    it('項目がすべて外れたグループの区切り線は描画しない', async () => {
      const withoutInsertion = ALL_FEATURES.filter(
        (feature) => !['horizontalRule', 'table', 'image', 'youtube'].includes(feature),
      )
      render(<RichTextEditor features={withoutInsertion} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })

      // 「挿入」グループが空になり3グループになるので2本
      expect(getSeparatorCount()).toBe(2)
    })

    it('区切り線は支援技術から隠す', async () => {
      render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })

      const separators = screen.getByRole('toolbar').querySelectorAll(SEPARATOR_SELECTOR)
      for (const separator of separators) {
        expect(separator).toHaveAttribute('aria-hidden', 'true')
      }
    })

    it('左右矢印キーは区切り線を飛ばして次のグループの先頭へ移動する', async () => {
      render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })

      // 「テキスト装飾」グループの末尾から「テキストの意味づけ」グループの先頭へ
      screen.getByLabelText('テキスト配置: 左揃え').focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(screen.getByLabelText('リンク')).toHaveFocus()
    })
  })

  describe('disabled', () => {
    it('ツールバーは表示したまま、すべてのボタンを無効化する', async () => {
      render(<RichTextEditor disabled features={ALL_FEATURES} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })

      const buttons = within(screen.getByRole('toolbar')).getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      for (const button of buttons) {
        expect(button).toBeDisabled()
      }
    })

    it('ツールバーのボタンを押しても本文が変化せずonChangeも発火しない', async () => {
      const ref = createRef<RichTextEditorController>()
      const onChange = vi.fn()
      render(
        <RichTextEditor
          ref={ref}
          disabled
          features={['horizontalRule', 'bold']}
          defaultValue={{
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
          }}
          onChange={onChange}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })
      const before = JSON.stringify(ref.current!.getJSON())

      await userEvent.click(screen.getByLabelText('水平線'))
      await userEvent.click(screen.getByLabelText('太字'))

      expect(JSON.stringify(ref.current!.getJSON())).toBe(before)
      expect(screen.getByLabelText('太字')).toHaveAttribute('aria-pressed', 'false')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('disabledでないときはツールバーのボタンが有効', async () => {
      render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument()
      })
      expect(screen.getByLabelText('太字')).toBeEnabled()
    })
  })

  describe('disabled / readOnly の状態通知', () => {
    const findTextbox = async () => {
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      return textbox
    }

    it('通常時は aria-disabled も aria-readonly も付かない', async () => {
      render(<RichTextEditor />, { wrapper: Wrapper })
      const textbox = await findTextbox()
      expect(textbox).not.toHaveAttribute('aria-disabled')
      expect(textbox).not.toHaveAttribute('aria-readonly')
    })

    it('disabled のとき aria-disabled が付く', async () => {
      render(<RichTextEditor disabled />, { wrapper: Wrapper })
      const textbox = await findTextbox()
      await waitFor(() => expect(textbox).toHaveAttribute('aria-disabled', 'true'))
      expect(textbox).not.toHaveAttribute('aria-readonly')
    })

    it('readOnly のとき aria-readonly が付く', async () => {
      render(<RichTextEditor readOnly />, { wrapper: Wrapper })
      const textbox = await findTextbox()
      await waitFor(() => expect(textbox).toHaveAttribute('aria-readonly', 'true'))
      expect(textbox).not.toHaveAttribute('aria-disabled')
    })

    it('disabled を解除すると aria-disabled が外れる', async () => {
      const { rerender } = render(<RichTextEditor disabled />, { wrapper: Wrapper })
      const textbox = await findTextbox()
      await waitFor(() => expect(textbox).toHaveAttribute('aria-disabled', 'true'))

      // rerenderはrender時のwrapperを自動で再適用するため、ここでWrapperを重ねない
      // （重ねると要素の型が変わってRichTextEditorが再マウントされ、別のDOMを見ることになる）
      rerender(<RichTextEditor />)
      await waitFor(() => expect(textbox).not.toHaveAttribute('aria-disabled'))
    })
  })

  // features は「新しく適用できる操作」の制限であり、読み込める書式の制限ではない。
  describe('features 外の書式を含む入力', () => {
    const RICH_VALUE: RichTextJSON = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '見出し' }] },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: '斜体', marks: [{ type: 'italic' }] },
            {
              type: 'text',
              text: '赤字',
              marks: [{ type: 'textStyle', attrs: { color: '#ff0000' } }],
            },
          ],
        },
        { type: 'paragraph', content: [{ type: 'text', text: '無関係な段落' }] },
      ],
    }

    it('defaultValue の features 外の書式を保持する', async () => {
      render(<RichTextEditor features={['bold']} defaultValue={RICH_VALUE} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByText('見出し')).toBeInTheDocument()
      })
      expect(screen.getByText('斜体')).toBeInTheDocument()
      expect(screen.getByText('無関係な段落')).toBeInTheDocument()
    })

    it('value（controlled）の features 外の書式を保持する', async () => {
      render(<RichTextEditor features={['bold']} value={RICH_VALUE} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByText('見出し')).toBeInTheDocument()
      })
      expect(screen.getByText('無関係な段落')).toBeInTheDocument()
    })

    it('content（HTML）の features 外の書式を保持する', async () => {
      render(
        <RichTextEditor
          features={['bold']}
          content={{
            format: 'html',
            content: '<h2>見出し</h2><p><em>斜体</em></p><p>無関係な段落</p>',
          }}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => {
        expect(screen.getByText('見出し')).toBeInTheDocument()
      })
      expect(screen.getByText('斜体')).toBeInTheDocument()
      expect(screen.getByText('無関係な段落')).toBeInTheDocument()
    })

    it('features 外の書式を保持したままHTMLを出力する', async () => {
      const ref = createRef<RichTextEditorController>()
      render(<RichTextEditor ref={ref} features={['bold']} defaultValue={RICH_VALUE} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => {
        expect(screen.getByText('見出し')).toBeInTheDocument()
      })

      const html = ref.current!.getHTML()
      expect(html).toContain('<h2>')
      expect(html).toContain('<em>')
      expect(html).toContain('#ff0000')
    })
  })

  describe('showCharacterCount', () => {
    it('shows character count when showCharacterCount is true', async () => {
      render(
        <RichTextEditor
          showCharacterCount
          defaultValue={{
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'abc' }] }],
          }}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => {
        expect(screen.getByText('文字数：3')).toBeInTheDocument()
      })
    })

    it('does not show character count by default', async () => {
      render(<RichTextEditor />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })
      expect(screen.queryByText(/文字数：/)).not.toBeInTheDocument()
    })

    it('does not show character count when readOnly', async () => {
      render(<RichTextEditor showCharacterCount readOnly />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })
      expect(screen.queryByText(/文字数：/)).not.toBeInTheDocument()
    })
  })

  describe('content prop (旧 FlexibleRichTextEditor)', () => {
    it('HTML content を受け取ってエディタを描画する', async () => {
      render(<RichTextEditor content={{ format: 'html', content: '<p>HTMLコンテンツ</p>' }} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => {
        expect(screen.getByText('HTMLコンテンツ')).toBeInTheDocument()
      })
    })

    it('JSON content を受け取ってエディタを描画する', async () => {
      render(
        <RichTextEditor
          content={{
            format: 'json',
            content: {
              type: 'doc',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'JSONコンテンツ' }] }],
            },
          }}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => {
        expect(screen.getByText('JSONコンテンツ')).toBeInTheDocument()
      })
    })

    it('empty content で空のエディタを描画する', async () => {
      render(<RichTextEditor content={{ format: 'empty' }} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })
    })
  })

  // imperative API と onChange の meta.html はどちらも「HTML出力」を返すため、
  // どちらを使ってもサニタイズ結果が同じでなければならない。
  describe('ref.getHTML()', () => {
    const IMPERATIVE_FEATURES = ['image', 'color', 'backgroundColor', 'fontSize'] as const

    const renderWithRef = async (props: {
      defaultValue?: RichTextJSON
      content?: ExternalRichTextValue
    }) => {
      const ref = createRef<RichTextEditorController>()
      render(<RichTextEditor {...props} ref={ref} features={IMPERATIVE_FEATURES} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })
      return ref
    }

    it('直接JSONで渡された画像の危険な src を除去する', async () => {
      const ref = await renderWithRef({
        defaultValue: {
          type: 'doc',
          content: [{ type: 'image', attrs: { src: 'javascript:alert(1)', alt: 'x' } }],
        },
      })
      expect(ref.current?.getHTML()).not.toContain('javascript:')
    })

    it('直接JSONで渡された textStyle のCSS宣言追記を除去する', async () => {
      const ref = await renderWithRef({
        defaultValue: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'textStyle',
                      attrs: { color: 'red;background-image:url(https://evil.example/x)' },
                    },
                  ],
                  text: 'styled',
                },
              ],
            },
          ],
        },
      })
      const html = ref.current?.getHTML() ?? ''
      expect(html).not.toContain('background-image')
      expect(html).not.toContain('evil.example')
    })

    it('HTML入力から読み込んだ危険なCSS値を除去する', async () => {
      const ref = await renderWithRef({
        content: {
          format: 'html',
          content: '<p><span style="background-color: url(javascript:alert(1))">x</span></p>',
        },
      })
      expect(ref.current?.getHTML()).not.toContain('javascript:')
    })

    it('安全なコンテンツは保持する', async () => {
      const ref = await renderWithRef({
        defaultValue: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'textStyle', attrs: { color: '#ff0000', fontSize: '20px' } }],
                  text: 'styled',
                },
              ],
            },
          ],
        },
      })
      const html = ref.current?.getHTML() ?? ''
      // 共通シリアライザー経由になり、DOM往復による rgb() 正規化を受けず原値のまま出る
      expect(html).toContain('#ff0000')
      expect(html).toContain('20px')
      expect(html).toContain('styled')
    })
  })

  describe('サイズ指定', () => {
    it('height を渡すとエディタ領域の高さを表す CSS 変数が設定される', () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} height={200} />, {
        wrapper: Wrapper,
      })

      const content = container.querySelector<HTMLElement>('[data-smarthr-ui-input="true"]')

      expect(content!.style.getPropertyValue('--shr-rte-editor-height')).toBe('200px')
    })

    it('height に文字列を渡すとそのまま CSS 変数に反映される', () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} height="50vh" />, {
        wrapper: Wrapper,
      })

      const content = container.querySelector<HTMLElement>('[data-smarthr-ui-input="true"]')

      expect(content!.style.getPropertyValue('--shr-rte-editor-height')).toBe('50vh')
    })

    it('height 未指定のとき CSS 変数は設定されない', () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })

      const content = container.querySelector<HTMLElement>('[data-smarthr-ui-input="true"]')

      expect(content!.style.getPropertyValue('--shr-rte-editor-height')).toBe('')
    })

    /*
     * preflight 無効で既定が content-box のため、.ProseMirror を常時 border-box にすると
     * min-h-[8em] に縦 padding が含まれ、高さ未指定時のデフォルト高さが縮む。
     * jsdom はレイアウトを計算しないので、クラスの付与条件で退行を防ぐ。
     */
    const BOX_BORDER_CLASS = '[&_.ProseMirror]:shr-box-border'

    it('height 未指定のとき .ProseMirror を border-box にしない', () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })

      const content = container.querySelector<HTMLElement>('[data-smarthr-ui-input="true"]')

      expect(content!.className).not.toContain(BOX_BORDER_CLASS)
    })

    it('height 指定時は .ProseMirror を border-box にする', () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} height={200} />, {
        wrapper: Wrapper,
      })

      const content = container.querySelector<HTMLElement>('[data-smarthr-ui-input="true"]')

      expect(content!.className).toContain(BOX_BORDER_CLASS)
    })

    it('width を渡すとコンポーネント全体の幅に反映される', () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} width={400} />, {
        wrapper: Wrapper,
      })

      expect(container.querySelector('.smarthr-ui-RichTextEditor')).toHaveStyle({ width: '400px' })
    })

    const HANDLE_SELECTOR = '.smarthr-ui-RichTextEditor-resizeHandle'

    it('resizable のときリサイズハンドルが描画される', async () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} resizable />, {
        wrapper: Wrapper,
      })

      await waitFor(() => expect(container.querySelector(HANDLE_SELECTOR)).toBeInTheDocument())
    })

    it('resizable 未指定のときリサイズハンドルは描画されない', async () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })

      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

      expect(container.querySelector(HANDLE_SELECTOR)).not.toBeInTheDocument()
    })

    it('readOnly のときリサイズハンドルは描画されない', async () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} resizable readOnly />, {
        wrapper: Wrapper,
      })

      await waitFor(() =>
        expect(container.querySelector('[data-smarthr-ui-input="true"]')).toBeInTheDocument(),
      )

      expect(container.querySelector(HANDLE_SELECTOR)).not.toBeInTheDocument()
    })

    it('disabled のときリサイズハンドルは描画されない', async () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} resizable disabled />, {
        wrapper: Wrapper,
      })

      await waitFor(() =>
        expect(container.querySelector('[data-smarthr-ui-input="true"]')).toBeInTheDocument(),
      )

      expect(container.querySelector(HANDLE_SELECTOR)).not.toBeInTheDocument()
    })

    it('リサイズハンドルはアクセシビリティツリーに露出しない', async () => {
      const { container } = render(<RichTextEditor features={ALL_FEATURES} resizable />, {
        wrapper: Wrapper,
      })

      await waitFor(() => expect(container.querySelector(HANDLE_SELECTOR)).toBeInTheDocument())

      expect(container.querySelector(HANDLE_SELECTOR)).toHaveAttribute('aria-hidden', 'true')
    })

    it('文字数カウントの有無でリサイズハンドルの位置が変わらない', async () => {
      const withCount = render(
        <RichTextEditor features={ALL_FEATURES} resizable showCharacterCount />,
        { wrapper: Wrapper },
      )
      await waitFor(() =>
        expect(withCount.container.querySelector(HANDLE_SELECTOR)).toBeInTheDocument(),
      )
      const withCountParent =
        withCount.container.querySelector(HANDLE_SELECTOR)!.parentElement!.className

      const withoutCount = render(<RichTextEditor features={ALL_FEATURES} resizable />, {
        wrapper: Wrapper,
      })
      await waitFor(() =>
        expect(withoutCount.container.querySelector(HANDLE_SELECTOR)).toBeInTheDocument(),
      )
      const withoutCountParent =
        withoutCount.container.querySelector(HANDLE_SELECTOR)!.parentElement!.className

      // どちらも wrapper 直下に絶対配置される
      expect(withCountParent).toBe(withoutCountParent)
    })

    it('ドラッグするとエディタ領域の高さを表す CSS 変数が更新される', async () => {
      const { container } = render(
        <RichTextEditor features={ALL_FEATURES} resizable height={200} />,
        { wrapper: Wrapper },
      )

      await waitFor(() => expect(container.querySelector(HANDLE_SELECTOR)).toBeInTheDocument())

      const handle = container.querySelector(HANDLE_SELECTOR)!
      const content = container.querySelector<HTMLElement>('[data-smarthr-ui-input="true"]')!
      const proseMirror = content.querySelector<HTMLElement>('.ProseMirror')!
      proseMirror.getBoundingClientRect = () => ({ height: 200 }) as unknown as DOMRect

      // fireEvent.pointerDown は jsdom で clientY を伝えないため MouseEvent を直接投げる
      fireEvent(handle, new MouseEvent('pointerdown', { clientY: 100, bubbles: true }))
      fireEvent(window, new MouseEvent('pointermove', { clientY: 160 }))
      fireEvent(window, new MouseEvent('pointerup', {}))

      expect(content.style.getPropertyValue('--shr-rte-editor-height')).toBe('260px')
    })
  })
})
