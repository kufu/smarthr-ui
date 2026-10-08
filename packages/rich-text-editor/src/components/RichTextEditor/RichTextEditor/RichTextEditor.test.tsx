import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { FormControl, IntlProvider } from 'smarthr-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor'

import type { ExternalRichTextValue, RichTextEditorController, RichTextJSON } from '../types'
import type { TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const paragraphDoc = (text: string): RichTextJSON => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
})

// jsdom の contenteditable では文字入力を再現できないため、Tiptap が DOM に載せる editor から操作する
const getEditor = () => (screen.getByRole('textbox') as TiptapEditorHTMLElement).editor!

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
        <FormControl errorMessages="Required field" label="Description">
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
    expect(boldButton).not.toHaveAttribute('data-active')
  })

  it('切り替えないボタンには aria-pressed を付けない', async () => {
    render(<RichTextEditor features={['horizontalRule', 'table', 'image', 'youtube']} />, {
      wrapper: Wrapper,
    })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('元に戻す')).not.toHaveAttribute('aria-pressed')
    expect(screen.getByLabelText('やり直す')).not.toHaveAttribute('aria-pressed')
    expect(screen.getByLabelText('水平線')).not.toHaveAttribute('aria-pressed')
    expect(screen.getByLabelText('テーブルを挿入')).not.toHaveAttribute('aria-pressed')
    expect(screen.getByLabelText('画像を挿入')).not.toHaveAttribute('aria-pressed')
    expect(screen.getByLabelText('YouTube動画を埋め込む')).not.toHaveAttribute('aria-pressed')
  })

  it('選択中の書式が適用されている切り替えボタンは押下状態になる', async () => {
    render(
      <RichTextEditor
        features={['bold']}
        content={{ format: 'html', content: '<p><strong>bold</strong></p>' }}
      />,
      { wrapper: Wrapper },
    )
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    const boldButton = screen.getByLabelText('太字')
    expect(boldButton).toHaveAttribute('aria-pressed', 'true')
    expect(boldButton).toHaveAttribute('data-active')
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
          defaultValue={{
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
          }}
          features={['horizontalRule', 'bold']}
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
    const onChangeSpy = vi.fn()

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

    it.each([
      ['disabled', (on: boolean) => <RichTextEditor disabled={on} onChange={onChangeSpy} />],
      ['readOnly', (on: boolean) => <RichTextEditor readOnly={on} onChange={onChangeSpy} />],
    ])('%s の切り替えでは onChange を発火させない', async (_name, renderWith) => {
      onChangeSpy.mockClear()
      const { rerender } = render(renderWith(false), { wrapper: Wrapper })
      const textbox = await findTextbox()

      rerender(renderWith(true))
      await waitFor(() => expect(textbox).toHaveAttribute('contenteditable', 'false'))

      rerender(renderWith(false))
      await waitFor(() => expect(textbox).toHaveAttribute('contenteditable', 'true'))

      expect(onChangeSpy).not.toHaveBeenCalled()
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

  describe('ラベルのクリック', () => {
    it('ラベルをクリックすると本文にフォーカスする', async () => {
      const user = userEvent.setup()
      render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label="ラベル">
          <RichTextEditor />
        </FormControl>,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      await user.click(screen.getByText('ラベル'))

      // Tiptap の focus コマンドは requestAnimationFrame 越しに実行される
      await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())
    })

    it('2つ並んでいても取り違えない', async () => {
      const user = userEvent.setup()
      render(
        <>
          {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
          <FormControl label="ひとつめ">
            <RichTextEditor />
          </FormControl>
          {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
          <FormControl label="ふたつめ">
            <RichTextEditor />
          </FormControl>
        </>,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getAllByRole('textbox')).toHaveLength(2))

      await user.click(screen.getByText('ふたつめ'))

      await waitFor(() => expect(screen.getAllByRole('textbox')[1]).toHaveFocus())
      expect(screen.getAllByRole('textbox')[0]).not.toHaveFocus()
    })

    it('無効なときはフォーカスしない', async () => {
      const user = userEvent.setup()
      render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label="ラベル">
          <RichTextEditor disabled />
        </FormControl>,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      await user.click(screen.getByText('ラベル'))

      expect(screen.getByRole('textbox')).not.toHaveFocus()
    })

    it('ラベル内のリンクはリンクの操作を優先する', async () => {
      const user = userEvent.setup()
      render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl
          label={
            <span>
              ラベル
              <a href="https://example.com/help">詳細</a>
            </span>
          }
        >
          <RichTextEditor />
        </FormControl>,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      await user.click(screen.getByRole('link', { name: '詳細' }))

      expect(screen.getByRole('textbox')).not.toHaveFocus()
    })

    it('無関係なラベルのクリックに反応しない', async () => {
      const user = userEvent.setup()
      render(
        <>
          {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
          <FormControl label="ラベル">
            <RichTextEditor />
          </FormControl>
          <label htmlFor="other">別のフォーム</label>
          <input id="other" name="other" />
        </>,
        { wrapper: Wrapper },
      )
      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'ラベル' })).toBeInTheDocument(),
      )

      await user.click(screen.getByText('別のフォーム'))

      expect(screen.getByRole('textbox', { name: 'ラベル' })).not.toHaveFocus()
    })
  })

  describe('エラー状態', () => {
    const renderInFormControl = (props: { error?: boolean }, errorMessages?: string) =>
      render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl errorMessages={errorMessages} label="ラベル">
          <RichTextEditor {...props} />
        </FormControl>,
        { wrapper: Wrapper },
      )

    const wrapperEl = () => document.querySelector('.smarthr-ui-RichTextEditor')

    it.each([
      ['どちらも無い', {}, undefined, false],
      ['error prop だけ', { error: true }, undefined, true],
      ['FormControl だけ', {}, '必須です', true],
      ['両方', { error: true }, '必須です', true],
    ])('%s', async (_name, props, errorMessages, expected) => {
      renderInFormControl(props, errorMessages)
      const textbox = await waitFor(() => screen.getByRole('textbox'))

      await waitFor(() => {
        if (expected) {
          expect(textbox).toHaveAttribute('aria-invalid', 'true')
        } else {
          expect(textbox).not.toHaveAttribute('aria-invalid', 'true')
        }
      })
      expect(wrapperEl()?.className.includes('shr-rte-border-danger')).toBe(expected)
    })

    it('FormControl のエラーを解除しても error prop が残っていればエラーのまま', async () => {
      const { rerender } = renderInFormControl({ error: true }, '必須です')
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('aria-invalid', 'true'))

      rerender(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label="ラベル">
          <RichTextEditor error />
        </FormControl>,
      )

      expect(textbox).toHaveAttribute('aria-invalid', 'true')
      expect(wrapperEl()?.className).toContain('shr-rte-border-danger')
    })

    it('error prop を解除しても FormControl のエラーが残っていればエラーのまま', async () => {
      const { rerender } = renderInFormControl({ error: true }, '必須です')
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('aria-invalid', 'true'))

      rerender(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl errorMessages="必須です" label="ラベル">
          <RichTextEditor />
        </FormControl>,
      )

      expect(textbox).toHaveAttribute('aria-invalid', 'true')
      expect(wrapperEl()?.className).toContain('shr-rte-border-danger')
    })

    it('error prop を後から立てると反映される', async () => {
      const { rerender } = renderInFormControl({})
      const textbox = await waitFor(() => screen.getByRole('textbox'))

      rerender(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label="ラベル">
          <RichTextEditor error />
        </FormControl>,
      )

      await waitFor(() => expect(textbox).toHaveAttribute('aria-invalid', 'true'))
      expect(wrapperEl()?.className).toContain('shr-rte-border-danger')
    })

    it('aria-describedby の変更で error prop のエラーが消えない', async () => {
      const { rerender } = renderInFormControl({ error: true })
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('aria-invalid', 'true'))

      rerender(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label="ラベル" helpMessage="補足">
          <RichTextEditor error />
        </FormControl>,
      )

      await waitFor(() => expect(textbox).toHaveAttribute('aria-describedby'))
      expect(textbox).toHaveAttribute('aria-invalid', 'true')
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
      render(<RichTextEditor defaultValue={RICH_VALUE} features={['bold']} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByText('見出し')).toBeInTheDocument()
      })
      expect(screen.getByText('斜体')).toBeInTheDocument()
      expect(screen.getByText('無関係な段落')).toBeInTheDocument()
    })

    it('value（controlled）の features 外の書式を保持する', async () => {
      render(<RichTextEditor value={RICH_VALUE} features={['bold']} />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByText('見出し')).toBeInTheDocument()
      })
      expect(screen.getByText('無関係な段落')).toBeInTheDocument()
    })

    it('value の差し替えでは onChange を発火させない', async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <RichTextEditor value={paragraphDoc('before')} features={['bold']} onChange={onChange} />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('before')).toBeInTheDocument())

      rerender(
        <RichTextEditor value={paragraphDoc('after')} features={['bold']} onChange={onChange} />,
      )

      await waitFor(() => expect(screen.getByText('after')).toBeInTheDocument())
      expect(onChange).not.toHaveBeenCalled()
    })

    it('onChange の meta が ref の判定と一致する', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const ref = createRef<RichTextEditorController>()
      render(
        <RichTextEditor
          ref={ref}
          defaultValue={{ type: 'doc', content: [{ type: 'paragraph' }, { type: 'paragraph' }] }}
          features={ALL_FEATURES}
          onChange={onChange}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      // 本文を変えて onChange を発火させる
      await user.click(screen.getByRole('button', { name: '水平線' }))

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      const meta = onChange.mock.calls.at(-1)![1]
      expect(meta.isEmpty).toBe(ref.current!.isEmpty())
      expect(meta.text).toBe(ref.current!.getText())
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
      render(<RichTextEditor ref={ref} defaultValue={RICH_VALUE} features={['bold']} />, {
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

  describe('壊れた JSON を読み込んだとき', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    const paragraph = (text: string) => ({
      type: 'paragraph',
      content: [{ type: 'text', text }],
    })

    const BROKEN: Array<[string, unknown, string]> = [
      [
        '未知の node は中身の文字を段落として残す',
        {
          type: 'doc',
          content: [
            paragraph('前'),
            { type: 'mermaid', content: [{ type: 'text', text: '中' }] },
            paragraph('後'),
          ],
        },
        '前中後',
      ],
      [
        '未知の mark は装飾だけ外して文字を残す',
        {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '印', marks: [{ type: 'highlight' }] }],
            },
          ],
        },
        '印',
      ],
      [
        'schema に合わない構造は段落に包み直す',
        { type: 'doc', content: [{ type: 'text', text: '裸' }, paragraph('後')] },
        '裸後',
      ],
    ]

    const SHAPE_BROKEN: Array<[string, unknown, string]> = [
      [
        'null の要素は取り除く',
        { type: 'doc', content: [paragraph('前'), null, paragraph('後')] },
        '前後',
      ],
      [
        '文字列を持たない text ノードは取り除く',
        {
          type: 'doc',
          content: [paragraph('前'), { type: 'paragraph', content: [{ type: 'text' }] }],
        },
        '前',
      ],
      ['配列でない content は無視する', { type: 'doc', content: 'abc' }, ''],
    ]

    const editorText = () => document.querySelector('.ProseMirror')?.textContent

    const renderBroken = async (props: { defaultValue?: unknown; value?: unknown }) => {
      const onChange = vi.fn()
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const result = render(
        <RichTextEditor {...(props as { defaultValue?: RichTextJSON })} onChange={onChange} />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(document.querySelector('.ProseMirror')).toBeInTheDocument())

      return { ...result, onChange, warn }
    }

    it.each([...BROKEN, ...SHAPE_BROKEN])(
      'defaultValue: %s（文書全体を空にしない）',
      async (_, json, expected) => {
        const { onChange } = await renderBroken({ defaultValue: json })

        expect(editorText()).toBe(expected)
        expect(onChange).not.toHaveBeenCalled()
      },
    )

    it.each(BROKEN)('value: %s（文書全体を空にしない）', async (_, json, expected) => {
      await renderBroken({ value: json })

      expect(editorText()).toBe(expected)
    })

    it('value を壊れた JSON に差し替えても文書全体を空にしない', async () => {
      const { rerender } = await renderBroken({
        value: { type: 'doc', content: [paragraph('差し替え前')] },
      })
      expect(editorText()).toBe('差し替え前')

      rerender(<RichTextEditor value={BROKEN[0][1] as RichTextJSON} />)

      await waitFor(() => expect(editorText()).toBe('前中後'))
    })

    it.each(BROKEN)('装飾や要素を取り除いたときは警告を出す: %s', async (_, json) => {
      const { warn } = await renderBroken({ defaultValue: json })

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('RichTextEditor'),
        expect.anything(),
      )
    })

    it('正しい JSON では警告を出さない', async () => {
      const { warn } = await renderBroken({
        defaultValue: { type: 'doc', content: [paragraph('正常')] },
      })

      expect(editorText()).toBe('正常')
      expect(warn).not.toHaveBeenCalled()
    })
  })

  describe('showCharacterCount', () => {
    it('shows character count when showCharacterCount is true', async () => {
      render(
        <RichTextEditor
          defaultValue={{
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'abc' }] }],
          }}
          showCharacterCount
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
      render(<RichTextEditor readOnly showCharacterCount />, { wrapper: Wrapper })
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument()
      })
      expect(screen.queryByText(/文字数：/)).not.toBeInTheDocument()
    })
  })

  describe('content prop', () => {
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
  describe('ref.setHeading()', () => {
    it('同じレベルを2回設定しても解除されない', async () => {
      const ref = createRef<RichTextEditorController>()
      render(<RichTextEditor ref={ref} features={['heading']} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      ref.current!.setHeading(1)
      expect(document.querySelector('.ProseMirror h1')).not.toBeNull()

      ref.current!.setHeading(1)
      expect(document.querySelector('.ProseMirror h1')).not.toBeNull()
    })
  })

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
      expect(html).toContain('1.25rem')
      expect(html).toContain('styled')
    })

    // 保存データに pt が残ると、ブラウザのフォントサイズ設定に追従しないまま公開される
    it('HTML入力の pt 指定の文字サイズを rem にそろえて保持する', async () => {
      const ref = await renderWithRef({
        content: {
          format: 'html',
          content: '<p><span style="font-size:11pt;color:#353744">本文</span></p>',
        },
      })
      const json = JSON.stringify(ref.current?.getJSON())
      expect(json).toContain('0.9167rem')
      expect(json).not.toContain('11pt')
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
    const BOX_BORDER_CLASS = '[&_.ProseMirror]:shr-rte-box-border'

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
      const { container } = render(<RichTextEditor readOnly features={ALL_FEATURES} resizable />, {
        wrapper: Wrapper,
      })

      await waitFor(() =>
        expect(container.querySelector('[data-smarthr-ui-input="true"]')).toBeInTheDocument(),
      )

      expect(container.querySelector(HANDLE_SELECTOR)).not.toBeInTheDocument()
    })

    it('disabled のときリサイズハンドルは描画されない', async () => {
      const { container } = render(<RichTextEditor disabled features={ALL_FEATURES} resizable />, {
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

  describe('outputFormat', () => {
    it("'html' のとき onChange の第1引数は meta.html と同じ文字列になる", async () => {
      const onChange = vi.fn()
      render(<RichTextEditor outputFormat="html" onChange={onChange} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      act(() => {
        getEditor().commands.insertContent('本文')
      })

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      const [value, meta] = onChange.mock.calls.at(-1)!
      expect(value).toBe('<p>本文</p>')
      expect(value).toBe(meta.html)
    })

    it('既定では onChange の第1引数は JSON になる', async () => {
      const onChange = vi.fn()
      render(<RichTextEditor onChange={onChange} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      act(() => {
        getEditor().commands.insertContent('本文')
      })

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(onChange.mock.calls.at(-1)![0]).toMatchObject(paragraphDoc('本文'))
    })
  })

  describe('controlled の value', () => {
    // 保存や受け渡しの途中で null の属性が落ちた値を、親がそのまま戻してくる状況を作る
    const dropNullAttrs = (node: RichTextJSON): RichTextJSON =>
      JSON.parse(JSON.stringify(node, (_, v) => (v === null ? undefined : v)))

    const Controlled = ({ initial }: { initial: RichTextJSON }) => {
      const [value, setValue] = useState(initial)

      return <RichTextEditor value={value} onChange={(next) => setValue(dropNullAttrs(next))} />
    }

    it('既定値の属性が落ちた値を戻されても、キャレットの位置と編集履歴を保つ', async () => {
      render(<Controlled initial={paragraphDoc('ac')} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByText('ac')).toBeInTheDocument())
      const editor = getEditor()

      // 「a」と「c」の間に入力する。value を戻すたびに本文を作り直すと、キャレットが末尾へ飛ぶ。
      // 履歴は時刻の間隔（既定の newGroupDelay は 500ms）で区切られるため、実時間に左右されないよう止めておく
      const now = vi.spyOn(Date, 'now').mockReturnValue(Date.now())
      try {
        act(() => {
          editor.commands.setTextSelection(2)
          editor.commands.insertContent('b')
        })
        expect(screen.getByText('abc')).toBeInTheDocument()
        act(() => {
          editor.commands.insertContent('!')
        })
        expect(screen.getByText('ab!c')).toBeInTheDocument()
      } finally {
        now.mockRestore()
      }

      act(() => {
        editor.commands.undo()
      })
      await waitFor(() => expect(screen.getByText('ac')).toBeInTheDocument())
    })

    it('onChange で受け取った値を親がその場で書き換えて戻すと、書き換えた内容を表示する', async () => {
      const Uppercase = () => {
        const [value, setValue] = useState(paragraphDoc('a'))

        return (
          <RichTextEditor
            value={value}
            onChange={(next) => {
              next.content?.[0].content?.forEach((node) => {
                if (node.text) node.text = node.text.toUpperCase()
              })
              setValue(next)
            }}
          />
        )
      }
      render(<Uppercase />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument())

      act(() => {
        getEditor().chain().setTextSelection(2).insertContent('bc').run()
      })

      await waitFor(() => expect(screen.getByText('ABC')).toBeInTheDocument())
    })

    it.each<[string, () => RichTextJSON]>([
      [
        '末尾が箇条書き（エディタが末尾に段落を足す）',
        () => ({
          type: 'doc',
          content: [
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [{ type: 'paragraph', content: [{ type: 'text', text: '項目' }] }],
                },
              ],
            },
          ],
        }),
      ],
      [
        '読み込み時に正規化される文字サイズ',
        () => ({
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '大きい',
                  marks: [{ type: 'textStyle', attrs: { fontSize: '24px' } }],
                },
              ],
            },
          ],
        }),
      ],
    ])('%sでも、同じ内容の別オブジェクトなら本文を作り直さない', async (_, createValue) => {
      const { rerender } = render(<RichTextEditor value={createValue()} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
      const editor = getEditor()
      act(() => {
        editor.commands.setTextSelection(2)
      })
      const { doc } = editor.state

      rerender(<RichTextEditor value={createValue()} />)

      expect(editor.state.doc).toBe(doc)
    })

    it('onChange で受け取った値の属性を親が書き換えて戻すと、書き換えた内容を表示する', async () => {
      const Centered = () => {
        const [value, setValue] = useState(paragraphDoc('a'))

        return (
          <RichTextEditor
            value={value}
            onChange={(next) => {
              next.content![0].attrs!.textAlign = 'center'
              setValue(next)
            }}
          />
        )
      }
      render(<Centered />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument())

      act(() => {
        getEditor().chain().setTextSelection(2).insertContent('b').run()
      })

      await waitFor(() => expect(screen.getByText('ab')).toHaveStyle({ textAlign: 'center' }))
    })

    it('出力時に整える属性（class・rel）を持つリンクが本文にあっても、本文を作り直さない', async () => {
      const Echo = () => {
        const [value, setValue] = useState(paragraphDoc('ac'))

        return <RichTextEditor value={value} onChange={setValue} />
      }
      render(<Echo />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByText('ac')).toBeInTheDocument())
      const editor = getEditor()

      act(() => {
        editor
          .chain()
          .setTextSelection(2)
          .insertContent('<a href="https://example.com" class="external" rel="nofollow">b</a>')
          .run()
      })

      expect(editor.state.selection.from).toBe(3)
    })

    it('末尾の空段落を消した value に戻すと、空段落が消える', async () => {
      const { rerender } = render(
        <RichTextEditor
          value={{ type: 'doc', content: [...paragraphDoc('a').content!, { type: 'paragraph' }] }}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument())

      rerender(<RichTextEditor value={paragraphDoc('a')} />)

      expect(getEditor().state.doc.childCount).toBe(1)
    })

    it('ref.getJSON() の戻り値を書き換えても本文は変わらない', async () => {
      const ref = createRef<RichTextEditorController>()
      render(<RichTextEditor ref={ref} defaultValue={paragraphDoc('a')} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument())

      ref.current!.getJSON().content![0].attrs!.textAlign = 'center'

      expect(getEditor().state.doc.firstChild?.attrs.textAlign).toBeNull()
    })

    it('同じ内容の別オブジェクトを渡しても本文を作り直さない', async () => {
      const { rerender } = render(<RichTextEditor value={paragraphDoc('abc')} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByText('abc')).toBeInTheDocument())
      const editor = getEditor()
      act(() => {
        editor.commands.setTextSelection(2)
      })
      const { doc } = editor.state

      rerender(<RichTextEditor value={paragraphDoc('abc')} />)

      expect(editor.state.doc).toBe(doc)
      expect(editor.state.selection.from).toBe(2)
    })

    it('onChange で受け取った値へ戻すと、その間に差し替えた内容から戻る', async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <RichTextEditor value={paragraphDoc('a')} onChange={onChange} />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('a')).toBeInTheDocument())
      act(() => {
        getEditor().chain().setTextSelection(2).insertContent('b').run()
      })
      await waitFor(() => expect(onChange).toHaveBeenCalled())
      const emitted = onChange.mock.calls.at(-1)![0]
      rerender(<RichTextEditor value={emitted} onChange={onChange} />)

      rerender(<RichTextEditor value={paragraphDoc('外から差し替え')} onChange={onChange} />)
      await waitFor(() => expect(screen.getByText('外から差し替え')).toBeInTheDocument())

      rerender(<RichTextEditor value={emitted} onChange={onChange} />)
      await waitFor(() => expect(screen.getByText('ab')).toBeInTheDocument())
    })

    it('value・defaultValue・content を同時に渡すと value を表示する', async () => {
      render(
        <RichTextEditor
          value={paragraphDoc('value')}
          defaultValue={paragraphDoc('defaultValue')}
          content={{ format: 'html', content: '<p>content</p>' }}
        />,
        { wrapper: Wrapper },
      )

      await waitFor(() => expect(screen.getByText('value')).toBeInTheDocument())
      expect(screen.queryByText('defaultValue')).not.toBeInTheDocument()
      expect(screen.queryByText('content')).not.toBeInTheDocument()
    })

    it('value が無ければ defaultValue を content より優先する', async () => {
      render(
        <RichTextEditor
          defaultValue={paragraphDoc('defaultValue')}
          content={{ format: 'html', content: '<p>content</p>' }}
        />,
        { wrapper: Wrapper },
      )

      await waitFor(() => expect(screen.getByText('defaultValue')).toBeInTheDocument())
      expect(screen.queryByText('content')).not.toBeInTheDocument()
    })
  })

  describe('マウント時と placeholder の変更', () => {
    const listDoc: RichTextJSON = {
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '項目' }] }],
            },
          ],
        },
      ],
    }

    it('末尾が段落でない内容を読み込んだだけでは onChange を呼ばず履歴も積まない', async () => {
      const onChange = vi.fn()
      render(<RichTextEditor defaultValue={listDoc} placeholder="本文" onChange={onChange} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByText('項目')).toBeInTheDocument())

      expect(onChange).not.toHaveBeenCalled()
      expect(getEditor().can().undo()).toBe(false)
    })

    it('placeholder を変えたことでは onChange を呼ばず履歴も積まない', async () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <RichTextEditor defaultValue={listDoc} placeholder="本文" onChange={onChange} />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('項目')).toBeInTheDocument())

      rerender(<RichTextEditor defaultValue={listDoc} placeholder="別の文言" onChange={onChange} />)

      expect(onChange).not.toHaveBeenCalled()
      expect(getEditor().can().undo()).toBe(false)
    })
  })

  describe('onFocus / onBlur', () => {
    it('本文へのフォーカスの出入りで呼ばれる', async () => {
      const user = userEvent.setup()
      const onFocus = vi.fn()
      const onBlur = vi.fn()
      render(
        <>
          <RichTextEditor hideToolbar onFocus={onFocus} onBlur={onBlur} />
          <button type="button">外</button>
        </>,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      await user.tab()
      expect(screen.getByRole('textbox')).toHaveFocus()
      await waitFor(() => expect(onFocus).toHaveBeenCalledTimes(1))
      expect(onBlur).not.toHaveBeenCalled()

      await user.tab()
      expect(screen.getByRole('button', { name: '外' })).toHaveFocus()
      await waitFor(() => expect(onBlur).toHaveBeenCalledTimes(1))
    })
  })

  describe('ref', () => {
    it('focus() で本文にフォーカスする', async () => {
      const ref = createRef<RichTextEditorController>()
      render(<RichTextEditor ref={ref} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      act(() => ref.current?.focus())

      await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())
    })

    it('エディタの準備が整う前は空の値を返し、操作しても例外を投げない', async () => {
      let beforeReady: Record<string, unknown> | undefined
      const captureFirst = (controller: RichTextEditorController | null) => {
        if (controller && !beforeReady) {
          controller.focus()
          controller.clear()
          controller.toggleBold()
          beforeReady = {
            json: controller.getJSON(),
            html: controller.getHTML(),
            text: controller.getText(),
            isEmpty: controller.isEmpty(),
          }
        }
      }
      render(<RichTextEditor ref={captureFirst} defaultValue={paragraphDoc('本文')} />, {
        wrapper: Wrapper,
      })

      await waitFor(() => expect(screen.getByText('本文')).toBeInTheDocument())
      expect(beforeReady).toEqual({
        json: { type: 'doc', content: [] },
        html: '',
        text: '',
        isEmpty: true,
      })
    })
  })

  describe('編集後の表示の更新', () => {
    it('文字数の表示が編集に追従する', async () => {
      render(<RichTextEditor defaultValue={paragraphDoc('abc')} showCharacterCount />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByText('文字数：3')).toBeInTheDocument())

      act(() => {
        getEditor().chain().setTextSelection(4).insertContent('de').run()
      })

      await waitFor(() => expect(screen.getByText('文字数：5')).toBeInTheDocument())
    })

    it('readOnly の切り替えでツールバーが出入りする', async () => {
      const { rerender } = render(<RichTextEditor />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

      rerender(<RichTextEditor readOnly />)
      await waitFor(() => expect(screen.queryByRole('toolbar')).not.toBeInTheDocument())

      rerender(<RichTextEditor />)
      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())
    })
  })
})
