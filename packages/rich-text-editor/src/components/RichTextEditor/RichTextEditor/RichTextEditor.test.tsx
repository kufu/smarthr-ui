import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { FormControl, IntlProvider } from 'smarthr-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getPlainText } from '../serializers/getPlainText'

import { RichTextEditor } from './RichTextEditor'

import type {
  RichTextChangeMeta,
  RichTextEditorController,
  RichTextEditorProps,
  RichTextFeature,
  RichTextJSON,
  RichTextValue,
} from '../types'
import type { Editor, TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const paragraphDoc = (text: string): RichTextJSON => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
})

vi.mock('../serializers/getPlainText', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  return { ...actual, getPlainText: vi.fn(actual.getPlainText as typeof getPlainText) }
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

  it('has aria-pressed on toggle buttons', async () => {
    render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })
    const boldButton = screen.getByLabelText('太字')
    expect(boldButton).toBeEnabled()
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
        defaultValue={{ format: 'html', content: '<p><strong>bold</strong></p>' }}
        features={['bold']}
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

  describe('Tab での到達', () => {
    const renderBetweenButtons = (editor: ReactNode) =>
      render(
        <>
          <button type="button">前</button>
          {editor}
          <button type="button">後</button>
        </>,
        { wrapper: Wrapper },
      )

    it('readOnly でも Tab で本文に移れる', async () => {
      const user = userEvent.setup()
      renderBetweenButtons(<RichTextEditor readOnly />)
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('contenteditable', 'false'))

      screen.getByRole('button', { name: '前' }).focus()
      await user.tab()

      expect(textbox).toHaveFocus()
    })

    it('readOnly の本文にフォーカスしても、末尾がリストの文書に段落を足さない', async () => {
      const user = userEvent.setup()
      const value: RichTextJSON = {
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
      const ref = createRef<RichTextEditorController>()
      renderBetweenButtons(<RichTextEditor ref={ref} readOnly defaultValue={value} />)
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('aria-readonly', 'true'))

      screen.getByRole('button', { name: '前' }).focus()
      await user.tab()

      expect(textbox).toHaveFocus()
      expect(ref.current!.getJSON().content?.map((node) => node.type)).toEqual(['bulletList'])
    })

    it.each([
      ['disabled', <RichTextEditor key="d" disabled />],
      ['disabled と readOnly の両方', <RichTextEditor key="dr" disabled readOnly />],
    ])('%s のときは Tab で本文を飛ばす', async (_name, editor) => {
      const user = userEvent.setup()
      renderBetweenButtons(editor)
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('contenteditable', 'false'))

      screen.getByRole('button', { name: '前' }).focus()
      await user.tab()

      expect(screen.getByRole('button', { name: '後' })).toHaveFocus()
    })

    it('readOnly から disabled に切り替えると Tab で本文を飛ばす', async () => {
      const user = userEvent.setup()
      const { rerender } = renderBetweenButtons(<RichTextEditor readOnly />)
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('aria-readonly', 'true'))

      rerender(
        <>
          <button type="button">前</button>
          <RichTextEditor disabled />
          <button type="button">後</button>
        </>,
      )
      await waitFor(() => expect(textbox).toHaveAttribute('aria-disabled', 'true'))

      screen.getByRole('button', { name: '前' }).focus()
      await user.tab()

      expect(screen.getByRole('button', { name: '後' })).toHaveFocus()
    })

    it('readOnly の本文にフォーカスしたまま disabled に切り替えると、フォーカスが外れる', async () => {
      const user = userEvent.setup()
      const { rerender } = renderBetweenButtons(<RichTextEditor readOnly />)
      const textbox = await waitFor(() => screen.getByRole('textbox'))
      await waitFor(() => expect(textbox).toHaveAttribute('aria-readonly', 'true'))

      screen.getByRole('button', { name: '前' }).focus()
      await user.tab()
      expect(textbox).toHaveFocus()

      rerender(
        <>
          <button type="button">前</button>
          <RichTextEditor disabled />
          <button type="button">後</button>
        </>,
      )

      await waitFor(() => expect(textbox).not.toHaveFocus())
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

    it('readOnly のときもフォーカスする', async () => {
      const user = userEvent.setup()
      render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label="ラベル">
          <RichTextEditor readOnly />
        </FormControl>,
        { wrapper: Wrapper },
      )
      await waitFor(() =>
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-readonly', 'true'),
      )

      await user.click(screen.getByText('ラベル'))

      await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())
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

  describe('FormControl のラベルとの紐付け', () => {
    it('ラベルの id が後から変わっても、ラベルの文言を名前として読み上げる', async () => {
      const { rerender } = render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label={{ text: 'ラベル', id: 'first-label' }}>
          <RichTextEditor />
        </FormControl>,
        { wrapper: Wrapper },
      )
      await waitFor(() =>
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-labelledby', 'first-label'),
      )

      rerender(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label={{ text: 'ラベル', id: 'second-label' }}>
          <RichTextEditor />
        </FormControl>,
      )

      await waitFor(() =>
        expect(screen.getByRole('textbox')).toHaveAttribute('aria-labelledby', 'second-label'),
      )
      expect(screen.getByRole('textbox', { name: 'ラベル' })).toBeInTheDocument()
    })

    it('ラベルが別の要素を指すと名前にせず、指し直すと名前に戻す', async () => {
      const { rerender } = render(
        <>
          {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
          <FormControl label={{ text: 'ラベル', htmlFor: 'editor' }}>
            <RichTextEditor />
          </FormControl>
          <div id="other" />
        </>,
        { wrapper: Wrapper },
      )
      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'ラベル' })).toBeInTheDocument(),
      )

      rerender(
        <>
          {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
          <FormControl label={{ text: 'ラベル', htmlFor: 'other' }}>
            <RichTextEditor />
          </FormControl>
          <div id="other" />
        </>,
      )

      await waitFor(() =>
        expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-labelledby'),
      )

      rerender(
        <>
          {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
          <FormControl label={{ text: 'ラベル', htmlFor: 'editor' }}>
            <RichTextEditor />
          </FormControl>
          <div id="other" />
        </>,
      )

      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'ラベル' })).toBeInTheDocument(),
      )
    })

    it('Shadow DOM の中でも、ラベルと紐付き、クリックで本文にフォーカスし、disabled で外れる', async () => {
      const host = document.createElement('div')
      document.body.appendChild(host)
      const container = document.createElement('div')
      const shadowRoot = host.attachShadow({ mode: 'open' })
      shadowRoot.appendChild(container)
      // jsdom は navigator.vendor から Safari と判定され、ProseMirror が Shadow DOM 向けに
      // document.execCommand を呼ぶ。jsdom には無い
      const execCommand = vi.fn()
      Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand })

      try {
        const { rerender } = render(
          // eslint-disable-next-line smarthr/a11y-form-control-in-form
          <FormControl label={{ text: 'ラベル', id: 'shadow-label' }}>
            <RichTextEditor />
          </FormControl>,
          { wrapper: Wrapper, container },
        )

        const textbox = container.querySelector('[role="textbox"]')
        await waitFor(() => expect(textbox).toHaveAttribute('aria-labelledby', 'shadow-label'))

        await userEvent.setup().click(within(container).getByText('ラベル'))

        // toHaveFocus は document.activeElement を見るため、Shadow DOM の中のフォーカスを判定できない
        await waitFor(() => expect(shadowRoot.activeElement).toBe(textbox))

        rerender(
          // eslint-disable-next-line smarthr/a11y-form-control-in-form
          <FormControl label={{ text: 'ラベル', id: 'shadow-label' }}>
            <RichTextEditor disabled />
          </FormControl>,
        )

        await waitFor(() => expect(shadowRoot.activeElement).not.toBe(textbox))
      } finally {
        host.remove()
        delete (document as { execCommand?: unknown }).execCommand
      }
    })

    it('入力欄の id に引用符が含まれていても、ラベルと紐付く', async () => {
      render(
        // eslint-disable-next-line smarthr/a11y-form-control-in-form
        <FormControl label={{ text: 'ラベル', htmlFor: 'editor"1' }}>
          <RichTextEditor />
        </FormControl>,
        { wrapper: Wrapper },
      )

      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'ラベル' })).toBeInTheDocument(),
      )
    })
  })

  describe('FormControl を使わない名前と説明', () => {
    const EXTERNAL_NAME_ID = 'external-name'

    it('aria-label を名前にする', async () => {
      render(<RichTextEditor aria-label="本文" />, { wrapper: Wrapper })

      await waitFor(() => expect(screen.getByRole('textbox', { name: '本文' })).toBeInTheDocument())
    })

    it('aria-labelledby が指す要素の文言を名前にする', async () => {
      render(
        <>
          <span id={EXTERNAL_NAME_ID}>外部の見出し</span>
          <RichTextEditor aria-labelledby={EXTERNAL_NAME_ID} />
        </>,
        { wrapper: Wrapper },
      )

      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: '外部の見出し' })).toBeInTheDocument(),
      )
    })

    it('id を指定すると、その id を指す label の文言を名前にし、クリックで本文にフォーカスする', async () => {
      const user = userEvent.setup()
      render(
        <>
          <label id="own-label" htmlFor="own-editor">
            自前のラベル
          </label>
          <RichTextEditor id="own-editor" />
        </>,
        { wrapper: Wrapper },
      )
      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: '自前のラベル' })).toHaveAttribute(
          'id',
          'own-editor',
        ),
      )

      await user.click(screen.getByText('自前のラベル'))

      await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())
    })

    it('id を変えると、新しい id を指す label の文言を名前にする', async () => {
      const renderWith = (editorId: string) => (
        <>
          <label id="first-label" htmlFor="first-editor">
            ひとつめ
          </label>
          <label id="second-label" htmlFor="second-editor">
            ふたつめ
          </label>
          <RichTextEditor id={editorId} />
        </>
      )
      const { rerender } = render(renderWith('first-editor'), { wrapper: Wrapper })
      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'ひとつめ' })).toBeInTheDocument(),
      )

      rerender(renderWith('second-editor'))

      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: 'ふたつめ' })).toHaveAttribute(
          'id',
          'second-editor',
        ),
      )
    })

    it('id の指定をやめると、本文からも id を外す', async () => {
      const { rerender } = render(<RichTextEditor id="own-editor" />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toHaveAttribute('id', 'own-editor'))

      rerender(<RichTextEditor />)

      await waitFor(() => expect(screen.getByRole('textbox')).not.toHaveAttribute('id'))
    })

    it('aria-describedby が指す要素の文言を説明にする', async () => {
      render(
        <>
          <p id="external-description">補足</p>
          <RichTextEditor aria-label="本文" aria-describedby="external-description" />
        </>,
        { wrapper: Wrapper },
      )

      await waitFor(() =>
        expect(screen.getByRole('textbox', { name: '本文' })).toHaveAccessibleDescription('補足'),
      )
    })

    it('aria-label の指定をやめると、本文からも外す', async () => {
      const { rerender } = render(<RichTextEditor aria-label="本文" />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox', { name: '本文' })).toBeInTheDocument())

      rerender(<RichTextEditor />)

      await waitFor(() => expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-label'))
    })

    describe('FormControl と併用したとき', () => {
      it('aria-label を指定すると、FormControl のラベルより優先する', async () => {
        render(
          // eslint-disable-next-line smarthr/a11y-form-control-in-form
          <FormControl label="ラベル">
            <RichTextEditor aria-label="本文" />
          </FormControl>,
          { wrapper: Wrapper },
        )

        await waitFor(() =>
          expect(screen.getByRole('textbox', { name: '本文' })).toBeInTheDocument(),
        )
      })

      it('aria-labelledby の指定をやめると、FormControl のラベルを名前に戻す', async () => {
        const renderWith = (labelledBy?: string) => (
          <>
            <span id={EXTERNAL_NAME_ID}>外部の見出し</span>
            {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
            <FormControl label="ラベル">
              <RichTextEditor aria-labelledby={labelledBy} />
            </FormControl>
          </>
        )
        const { rerender } = render(renderWith(EXTERNAL_NAME_ID), { wrapper: Wrapper })
        await waitFor(() =>
          expect(screen.getByRole('textbox', { name: '外部の見出し' })).toBeInTheDocument(),
        )

        rerender(renderWith(undefined))

        await waitFor(() =>
          expect(screen.getByRole('textbox', { name: 'ラベル' })).toBeInTheDocument(),
        )
      })

      it('aria-describedby に FormControl の補足と同じ id を渡しても、重ねて読ませない', async () => {
        const renderWith = (describedBy?: string) => (
          // eslint-disable-next-line smarthr/a11y-form-control-in-form
          <FormControl label="ラベル" helpMessage="FormControl の補足">
            <RichTextEditor aria-describedby={describedBy} />
          </FormControl>
        )
        const { rerender } = render(renderWith(), { wrapper: Wrapper })
        const helpMessageId = await waitFor(() => {
          const { id } = screen.getByText('FormControl の補足')
          expect(id).not.toBe('')
          return id
        })

        rerender(renderWith(helpMessageId))

        await waitFor(() =>
          expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', helpMessageId),
        )
      })

      it('指定した id を使い、FormControl のラベルと紐付く', async () => {
        render(
          // eslint-disable-next-line smarthr/a11y-form-control-in-form
          <FormControl label="ラベル">
            <RichTextEditor id="own-editor" />
          </FormControl>,
          { wrapper: Wrapper },
        )

        await waitFor(() =>
          expect(screen.getByRole('textbox', { name: 'ラベル' })).toHaveAttribute(
            'id',
            'own-editor',
          ),
        )
      })

      it('aria-labelledby を指定すると、FormControl のラベルより優先する', async () => {
        render(
          <>
            <span id={EXTERNAL_NAME_ID}>外部の見出し</span>
            {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
            <FormControl label="ラベル">
              <RichTextEditor aria-labelledby={EXTERNAL_NAME_ID} />
            </FormControl>
          </>,
          { wrapper: Wrapper },
        )

        await waitFor(() =>
          expect(screen.getByRole('textbox', { name: '外部の見出し' })).toBeInTheDocument(),
        )
      })

      it('aria-describedby は FormControl の補足と両方を説明にする', async () => {
        render(
          <>
            <p id="external-description">外部の補足</p>
            {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
            <FormControl label="ラベル" helpMessage="FormControl の補足">
              <RichTextEditor aria-describedby="external-description" />
            </FormControl>
          </>,
          { wrapper: Wrapper },
        )

        await waitFor(() =>
          expect(screen.getByRole('textbox', { name: 'ラベル' })).toHaveAccessibleDescription(
            '外部の補足 FormControl の補足',
          ),
        )
      })

      it('aria-describedby を変えても、FormControl の補足との両方を説明にする', async () => {
        const renderWith = (describedBy: string) => (
          <>
            <p id="first-description">補足A</p>
            <p id="second-description">補足B</p>
            {/* eslint-disable-next-line smarthr/a11y-form-control-in-form */}
            <FormControl label="ラベル" helpMessage="FormControl の補足">
              <RichTextEditor aria-describedby={describedBy} />
            </FormControl>
          </>
        )
        const { rerender } = render(renderWith('first-description'), { wrapper: Wrapper })
        await waitFor(() =>
          expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
            '補足A FormControl の補足',
          ),
        )

        rerender(renderWith('second-description'))

        await waitFor(() =>
          expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
            '補足B FormControl の補足',
          ),
        )
      })
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

    it('onChange で受け取った値を書き換えても、meta.html は通知した時点の本文のまま', async () => {
      let html: string | undefined
      const onChange = vi.fn((value: RichTextJSON, meta: RichTextChangeMeta) => {
        value.content = [{ type: 'paragraph', content: [{ type: 'text', text: '書き換え' }] }]
        html = meta.html
      })
      render(<RichTextEditor onChange={onChange} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

      act(() => {
        getEditor().commands.insertContent('本文')
      })

      await waitFor(() => expect(onChange).toHaveBeenCalled())
      expect(html).toBe('<p>本文</p>')
      expect(onChange.mock.calls.at(-1)![1].text).toBe('本文')
    })

    it('HTML で渡した初期値の features 外の書式を保持する', async () => {
      render(
        <RichTextEditor
          defaultValue={{
            format: 'html',
            content: '<h2>見出し</h2><p><em>斜体</em></p><p>無関係な段落</p>',
          }}
          features={['bold']}
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

    it('キャレットを動かすだけでは文字数を数え直さない', async () => {
      render(<RichTextEditor defaultValue={paragraphDoc('abc')} showCharacterCount />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByText('文字数：3')).toBeInTheDocument())
      vi.mocked(getPlainText).mockClear()

      act(() => {
        getEditor().commands.setTextSelection(2)
      })

      expect(getPlainText).not.toHaveBeenCalled()
    })

    it('1回の入力で、表示と onChange の文字数を1回だけ数える', async () => {
      const onChange = vi.fn()
      render(
        <RichTextEditor
          defaultValue={paragraphDoc('abc')}
          showCharacterCount
          onChange={onChange}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('文字数：3')).toBeInTheDocument())
      vi.mocked(getPlainText).mockClear()

      act(() => {
        getEditor().chain().setTextSelection(4).insertContent('de').run()
      })

      await waitFor(() => expect(screen.getByText('文字数：5')).toBeInTheDocument())
      expect(onChange.mock.calls.at(-1)![1].characterCount).toBe(5)
      expect(getPlainText).toHaveBeenCalledTimes(1)
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

  describe('末尾が段落でない文書', () => {
    const LIST_END_DOC: RichTextJSON = {
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

    const renderListEnd = async (onChange = vi.fn()) => {
      render(
        <RichTextEditor
          defaultValue={LIST_END_DOC}
          features={[...ALL_FEATURES]}
          onChange={onChange}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('項目')).toBeInTheDocument())

      return onChange
    }

    it('キャレットを動かすだけでは、末尾に段落が足されても onChange も履歴も出ない', async () => {
      const onChange = await renderListEnd()

      act(() => {
        getEditor().commands.setTextSelection(2)
      })

      expect(getEditor().state.doc.lastChild?.type.name).toBe('paragraph')
      expect(onChange).not.toHaveBeenCalled()
      expect(getEditor().can().undo()).toBe(false)
    })

    it('末尾に表などを挿入して段落が足されたときは、取り消すと挿入前に戻る', async () => {
      render(<RichTextEditor defaultValue={paragraphDoc('本文')} features={[...ALL_FEATURES]} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(screen.getByText('本文')).toBeInTheDocument())
      const before = getEditor().getJSON()

      act(() => {
        const editor = getEditor()
        editor
          .chain()
          .insertContentAt(editor.state.doc.content.size, { type: 'horizontalRule' })
          .run()
      })
      expect(getEditor().state.doc.lastChild?.type.name).toBe('paragraph')

      act(() => {
        getEditor().commands.undo()
      })

      expect(getEditor().getJSON()).toEqual(before)
    })

    it('足された段落に入力すると onChange が呼ばれ、取り消せる', async () => {
      const onChange = await renderListEnd()
      act(() => {
        getEditor().commands.setTextSelection(2)
      })

      act(() => {
        getEditor().chain().focus('end').insertContent('追記').run()
      })

      expect(onChange).toHaveBeenCalled()
      act(() => {
        getEditor().commands.undo()
      })
      expect(getEditor().getText()).not.toContain('追記')
    })
  })

  describe('対応外の見出しレベルの読み込み', () => {
    it('level 5 の見出しは表示・出力とも level 4 にそろう', async () => {
      const ref = createRef<RichTextEditorController>()
      render(
        <RichTextEditor
          ref={ref}
          defaultValue={{
            type: 'doc',
            content: [
              { type: 'heading', attrs: { level: 5 }, content: [{ type: 'text', text: '見出し' }] },
            ],
          }}
          features={['heading']}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('見出し')).toBeInTheDocument())

      expect(document.querySelector('.ProseMirror h4')).toHaveTextContent('見出し')
      expect(ref.current!.getJSON().content?.[0]?.attrs?.level).toBe(4)
    })
  })

  describe('ref.getHTML()', () => {
    const IMPERATIVE_FEATURES = ['image', 'color', 'backgroundColor', 'fontSize'] as const

    const renderWithRef = async (props: { defaultValue?: RichTextValue }) => {
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
        defaultValue: {
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
        defaultValue: {
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

  describe('入力の形式（value・defaultValue）', () => {
    it.each<[string, RichTextValue]>([
      ['素の JSON', paragraphDoc('初期値')],
      ['format: json', { format: 'json', content: paragraphDoc('初期値') }],
      ['format: html', { format: 'html', content: '<p>初期値</p>' }],
    ])('defaultValue に %s を渡すと初期表示する', async (_, defaultValue) => {
      render(<RichTextEditor defaultValue={defaultValue} />, { wrapper: Wrapper })

      expect(await screen.findByText('初期値')).toBeInTheDocument()
    })

    it('HTML で読み込み、outputFormat が既定のときは onChange が JSON を返す', async () => {
      const onChange = vi.fn()
      render(
        <RichTextEditor
          defaultValue={{ format: 'html', content: '<p>移行</p>' }}
          onChange={onChange}
        />,
        { wrapper: Wrapper },
      )
      await screen.findByText('移行')

      act(() => {
        getEditor().chain().focus('end').insertContent('済').run()
      })

      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'doc' }),
        expect.anything(),
      )
      expect(onChange.mock.lastCall?.[1].text).toBe('移行済')
    })

    it('解決できない値は空の文書として表示し、例外を投げない', async () => {
      render(<RichTextEditor defaultValue={{ format: 'markdown' } as unknown as RichTextValue} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(getEditor()).toBeDefined())

      expect(getEditor().isEmpty).toBe(true)
    })

    it('空の段落に付けた配置は、onChange の JSON に残る', async () => {
      const onChange = vi.fn()
      render(<RichTextEditor defaultValue={{ format: 'empty' }} onChange={onChange} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(getEditor()).toBeDefined())

      act(() => {
        getEditor().commands.setTextAlign('center')
      })

      expect(onChange.mock.lastCall?.[1].isEmpty).toBe(true)
      expect(onChange.mock.lastCall?.[0].content[0].attrs.textAlign).toBe('center')
    })

    it.each<[string, unknown]>([
      ['null', null],
      ['文字列', '<p>本文</p>'],
    ])('value に %s が渡されても例外を投げず、空として扱う', async (_, value) => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { rerender } = render(<RichTextEditor value={value as RichTextValue} />, {
        wrapper: Wrapper,
      })
      await waitFor(() => expect(getEditor()).toBeDefined())

      rerender(<RichTextEditor value={value as RichTextValue} />)

      expect(getEditor().isEmpty).toBe(true)
      vi.restoreAllMocks()
    })

    // 親が state に持って毎回同じオブジェクトを渡す保存済みの JSON
    const SAVED_DOC = paragraphDoc('保存前')

    it.each<[string, (text: string) => RichTextValue]>([
      ['format: html', (text) => ({ format: 'html', content: `<p>${text}</p>` })],
      ['format: json', () => ({ format: 'json', content: SAVED_DOC })],
    ])(
      '%s の value を親が戻さないまま別の理由で再描画しても、入力した文字を消さない',
      async (_, toValue) => {
        let rerenderParent = () => {}
        const Parent = () => {
          const [, setTick] = useState(0)
          rerenderParent = () => setTick((tick) => tick + 1)

          // 保存してから値を戻す親のように、onChange を受けてもすぐには value を更新しない
          return <RichTextEditor value={toValue('保存前')} onChange={() => {}} />
        }
        render(<Parent />, { wrapper: Wrapper })
        await screen.findByText('保存前')
        act(() => {
          getEditor().chain().focus('end').insertContent('入力').run()
        })

        act(() => {
          rerenderParent()
        })

        expect(getEditor().state.doc.textContent).toBe('保存前入力')
      },
    )

    it.each<[string, RichTextValue, unknown]>([
      ['html の content を文字列から数値に変える', { format: 'html', content: '123' }, 123],
      [
        'toString を持たない content',
        { format: 'html', content: '<p>本文</p>' },
        { toString: null },
      ],
    ])('value の %s と、例外を投げずに空として扱う', async (_, before, afterContent) => {
      vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { rerender } = render(<RichTextEditor value={before} />, { wrapper: Wrapper })
      await waitFor(() => expect(getEditor().isEmpty).toBe(false))

      rerender(
        <RichTextEditor
          value={{ format: 'html', content: afterContent } as unknown as RichTextValue}
        />,
      )

      expect(getEditor().isEmpty).toBe(true)
      vi.restoreAllMocks()
    })

    it.each<[string, () => RichTextValue]>([
      ['format: empty', () => ({ format: 'empty' })],
      ['null', () => null as unknown as RichTextValue],
    ])('空になったときに親が %s を戻しても、空の段落に付けた配置を消さない', async (_, toEmpty) => {
      const Parent = () => {
        const [value, setValue] = useState<RichTextValue>(paragraphDoc('x'))

        return (
          <RichTextEditor
            value={value}
            onChange={(json, meta) => setValue(meta.isEmpty ? toEmpty() : json)}
          />
        )
      }
      render(<Parent />, { wrapper: Wrapper })
      await screen.findByText('x')

      act(() => {
        getEditor().chain().focus().setTextAlign('center').run()
      })
      act(() => {
        getEditor().chain().setTextSelection({ from: 1, to: 2 }).deleteSelection().run()
      })

      expect(getEditor().isEmpty).toBe(true)
      expect(getEditor().state.doc.firstChild?.attrs.textAlign).toBe('center')
    })

    it('空の段落を中央揃えにしたあとフォームをリセットすると、配置も戻す', async () => {
      let reset = () => {}
      const Form = () => {
        const [value, setValue] = useState<RichTextValue>({ format: 'empty' })
        reset = () => setValue({ format: 'empty' })

        return <RichTextEditor value={value} onChange={setValue} />
      }
      render(<Form />, { wrapper: Wrapper })
      await waitFor(() => expect(getEditor()).toBeDefined())
      act(() => {
        getEditor().commands.setTextAlign('center')
      })
      expect(getEditor().state.doc.firstChild?.attrs.textAlign).toBe('center')

      act(() => {
        reset()
      })

      expect(getEditor().state.doc.firstChild?.attrs.textAlign).toBeNull()
    })

    describe('空の本文と空に見える値の差し替え', () => {
      const emptyTable: RichTextJSON = {
        type: 'doc',
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [{ type: 'tableCell', content: [{ type: 'paragraph' }] }],
              },
            ],
          },
        ],
      }

      it.each<[string, RichTextValue, RichTextValue, (editor: Editor) => void]>([
        [
          '空の本文に、未知の型で包まれた本文を渡すと、修復して読み込む',
          { format: 'empty' },
          {
            type: 'doc',
            content: [
              {
                type: 'callout',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: '読込' }] }],
              },
            ],
          } as unknown as RichTextJSON,
          (editor) => expect(editor.state.doc.textContent).toBe('読込'),
        ],
        [
          '空の段落を、中央揃えの空の段落に変えると反映する',
          { type: 'doc', content: [{ type: 'paragraph' }] },
          { type: 'doc', content: [{ type: 'paragraph', attrs: { textAlign: 'center' } }] },
          (editor) => expect(editor.state.doc.firstChild?.attrs.textAlign).toBe('center'),
        ],
        [
          '空の本文に、空のセルだけの表を渡すと反映する',
          { format: 'empty' },
          emptyTable,
          (editor) => expect(editor.state.doc.firstChild?.type.name).toBe('table'),
        ],
        [
          '空の表がある本文に、データが無いことを表す値を渡すと空の段落にする',
          emptyTable,
          { format: 'empty' },
          (editor) => expect(editor.state.doc.firstChild?.type.name).toBe('paragraph'),
        ],
      ])('%s', async (_, before, after, assert) => {
        vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { rerender } = render(<RichTextEditor value={before} features={['table']} />, {
          wrapper: Wrapper,
        })
        await waitFor(() => expect(getEditor()).toBeDefined())

        rerender(<RichTextEditor value={after} features={['table']} />)

        assert(getEditor())
        vi.restoreAllMocks()
      })
    })

    describe('HTML の制御モード', () => {
      // 色名の文字色は、出力した HTML を読み戻すと属性が変わり、本文と一致しなくなる
      const COLORED_HTML = '<p>a<span style="color: red">L</span>c</p>'

      let setFromOutside: (html: string) => void = () => {}
      let emitted = ''
      const ControlledHtml = () => {
        const [html, setHtml] = useState(COLORED_HTML)
        setFromOutside = setHtml

        return (
          <RichTextEditor
            value={{ format: 'html', content: html }}
            outputFormat="html"
            onChange={(next) => {
              emitted = next
              setHtml(next)
            }}
          />
        )
      }

      it('onChange の HTML をそのまま戻しても、キャレットの位置を保つ', async () => {
        render(<ControlledHtml />, { wrapper: Wrapper })
        await screen.findByText('L')
        const editor = getEditor()

        act(() => {
          editor.commands.setTextSelection(2)
          editor.commands.insertContent('b')
        })
        act(() => {
          editor.commands.insertContent('!')
        })

        expect(editor.state.doc.textContent).toBe('ab!Lc')
      })

      it('親が HTML を整形して戻しても、キャレットの位置を保つ', async () => {
        const Formatting = () => {
          const [html, setHtml] = useState(COLORED_HTML)

          return (
            <RichTextEditor
              value={{ format: 'html', content: html }}
              outputFormat="html"
              onChange={(next) => setHtml(`\n${next}\n`)}
            />
          )
        }
        render(<Formatting />, { wrapper: Wrapper })
        await screen.findByText('L')
        const editor = getEditor()

        act(() => {
          editor.commands.setTextSelection(2)
          editor.commands.insertContent('b')
        })
        act(() => {
          editor.commands.insertContent('!')
        })

        expect(editor.state.doc.textContent).toBe('ab!Lc')
      })

      it('親が通知された JSON を書き換えて HTML で戻すと、書き換えた内容を表示する', async () => {
        const Uppercase = () => {
          const [html, setHtml] = useState('<p>ab</p>')

          return (
            <RichTextEditor
              value={{ format: 'html', content: html }}
              onChange={(json) => {
                json.content![0].content![0].text = 'ABC'
                setHtml('<p>ABC</p>')
              }}
            />
          )
        }
        render(<Uppercase />, { wrapper: Wrapper })
        await screen.findByText('ab')

        act(() => {
          getEditor().chain().focus('end').insertContent('c').run()
        })

        expect(getEditor().state.doc.textContent).toBe('ABC')
      })

      it('空の見出しで親が空の値を戻しても、見出しを保つ', async () => {
        const EmptyAsBlank = () => {
          const [html, setHtml] = useState('<h2>abc</h2>')

          return (
            <RichTextEditor
              value={{ format: 'html', content: html }}
              outputFormat="html"
              features={['heading']}
              onChange={(next, meta) => setHtml(meta.isEmpty ? '' : next)}
            />
          )
        }
        render(<EmptyAsBlank />, { wrapper: Wrapper })
        await screen.findByText('abc')

        act(() => {
          getEditor().chain().setTextSelection({ from: 1, to: 4 }).deleteSelection().run()
        })

        expect(getEditor().isEmpty).toBe(true)
        expect(getEditor().state.doc.firstChild?.type.name).toBe('heading')
      })

      it('編集して A を出したあと外から B、さらに A に戻すと、A を表示する', async () => {
        render(<ControlledHtml />, { wrapper: Wrapper })
        await screen.findByText('L')
        const editor = getEditor()
        act(() => {
          editor.chain().focus('end').insertContent('d').run()
        })
        const emittedA = emitted
        expect(editor.state.doc.textContent).toBe('aLcd')

        act(() => {
          setFromOutside('<p>B</p>')
        })
        expect(editor.state.doc.textContent).toBe('B')

        act(() => {
          setFromOutside(emittedA)
        })
        expect(editor.state.doc.textContent).toBe('aLcd')
      })
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

    it('value と defaultValue を同時に渡すと value を表示する', async () => {
      render(
        <RichTextEditor
          value={paragraphDoc('value')}
          defaultValue={{ format: 'html', content: '<p>defaultValue</p>' }}
        />,
        { wrapper: Wrapper },
      )

      await waitFor(() => expect(screen.getByText('value')).toBeInTheDocument())
      expect(screen.queryByText('defaultValue')).not.toBeInTheDocument()
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
        json: { type: 'doc', content: [{ type: 'paragraph' }] },
        html: '',
        text: '',
        isEmpty: true,
      })
    })

    const LINKED_DOC: RichTextJSON = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '本文',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            },
          ],
        },
      ],
    }

    const OPERATION_FEATURES: Array<
      [string, RichTextFeature, (controller: RichTextEditorController) => void]
    > = [
      ['toggleBold', 'bold', (c) => c.toggleBold()],
      ['toggleItalic', 'italic', (c) => c.toggleItalic()],
      ['toggleBulletList', 'bulletList', (c) => c.toggleBulletList()],
      ['toggleOrderedList', 'orderedList', (c) => c.toggleOrderedList()],
      ['toggleBlockquote', 'blockquote', (c) => c.toggleBlockquote()],
      ['setHeading', 'heading', (c) => c.setHeading(2)],
      ['setLink', 'link', (c) => c.setLink('https://example.org')],
      ['unsetLink', 'link', (c) => c.unsetLink()],
    ]

    const renderWithExternalButton = async (
      features: readonly RichTextFeature[],
      {
        defaultValue = LINKED_DOC,
        headingLevels,
      }: Pick<RichTextEditorProps, 'defaultValue' | 'headingLevels'> = {},
    ) => {
      const ref = createRef<RichTextEditorController>()
      const onChange = vi.fn()
      render(
        <>
          <button type="button">外部のボタン</button>
          <RichTextEditor
            ref={ref}
            defaultValue={defaultValue}
            features={features}
            headingLevels={headingLevels}
            onChange={onChange}
          />
        </>,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByText('本文')).toBeInTheDocument())
      act(() => {
        getEditor().commands.selectAll()
      })
      const externalButton = screen.getByRole('button', { name: '外部のボタン' })
      act(() => externalButton.focus())

      return { controller: ref.current!, onChange, externalButton }
    }

    const waitForFocusFrame = () =>
      act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

    it.each(OPERATION_FEATURES)(
      '%s() は features に %s があるとき、文書を変えて本文にフォーカスする',
      async (_name, _feature, operate) => {
        const { controller, onChange } = await renderWithExternalButton(ALL_FEATURES)
        const before = controller.getJSON()

        act(() => operate(controller))
        await waitForFocusFrame()

        expect(controller.getJSON()).not.toEqual(before)
        expect(onChange).toHaveBeenCalled()
        expect(screen.getByRole('textbox')).toHaveFocus()
      },
    )

    it.each(OPERATION_FEATURES)(
      '%s() は features に %s が無いとき、文書もフォーカスも変えない',
      async (_name, feature, operate) => {
        const { controller, onChange, externalButton } = await renderWithExternalButton(
          ALL_FEATURES.filter((f) => f !== feature),
        )
        const before = controller.getJSON()

        act(() => operate(controller))
        await waitForFocusFrame()

        expect(controller.getJSON()).toEqual(before)
        expect(onChange).not.toHaveBeenCalled()
        expect(externalButton).toHaveFocus()
      },
    )

    it('setHeading() は headingLevels に無いレベルのとき、文書もフォーカスも変えない', async () => {
      const { controller, onChange, externalButton } = await renderWithExternalButton(['heading'], {
        defaultValue: paragraphDoc('本文'),
        headingLevels: [2],
      })
      const before = controller.getJSON()

      act(() => controller.setHeading(3))
      await waitForFocusFrame()

      expect(controller.getJSON()).toEqual(before)
      expect(onChange).not.toHaveBeenCalled()
      expect(externalButton).toHaveFocus()
    })

    describe.each(['disabled', 'readOnly'] as const)('%s のとき', (state) => {
      // 書式の操作を全部は並べない。どれも同じ runIfAllowed の判定を通り、操作ごとの経路は features のテストで確かめている
      it('toggleBold() は文書を変えない', async () => {
        const ref = createRef<RichTextEditorController>()
        const onChange = vi.fn()
        render(
          <RichTextEditor
            ref={ref}
            disabled={state === 'disabled'}
            readOnly={state === 'readOnly'}
            defaultValue={LINKED_DOC}
            features={[...ALL_FEATURES]}
            onChange={onChange}
          />,
          { wrapper: Wrapper },
        )
        await waitFor(() => expect(screen.getByText('本文')).toBeInTheDocument())
        act(() => {
          getEditor().commands.selectAll()
        })
        const before = ref.current!.getJSON()

        act(() => ref.current!.toggleBold())

        expect(ref.current!.getJSON()).toEqual(before)
        expect(onChange).not.toHaveBeenCalled()
      })

      it('clear() はプログラムからのリセットとして効く', async () => {
        const ref = createRef<RichTextEditorController>()
        render(
          <RichTextEditor
            ref={ref}
            disabled={state === 'disabled'}
            readOnly={state === 'readOnly'}
            defaultValue={paragraphDoc('本文')}
          />,
          { wrapper: Wrapper },
        )
        await waitFor(() => expect(screen.getByText('本文')).toBeInTheDocument())

        act(() => ref.current!.clear())

        expect(ref.current!.isEmpty()).toBe(true)
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
