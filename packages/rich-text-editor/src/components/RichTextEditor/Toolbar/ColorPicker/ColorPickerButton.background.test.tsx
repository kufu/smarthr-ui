import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { RichTextFeature, RichTextJSON } from '../../types'
import type { JSONContent, TiptapEditorHTMLElement } from '@tiptap/core'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>{children}</EnvironmentProvider>
  </IntlProvider>
)

const renderEditor = async (html: string) => {
  render(
    <RichTextEditor
      defaultValue={{ format: 'html', content: html }}
      features={['backgroundColor']}
    />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

describe('ColorPickerButton（背景色）', () => {
  describe('トリガーのアクセシブル名', () => {
    it('背景色未指定のときは「なし」を含む', async () => {
      await renderEditor('<p>plain</p>')
      expect(screen.getByRole('button', { name: '背景色: なし' })).toBeInTheDocument()
    })

    it('標準パレットの色が適用されているときはその色名を含む', async () => {
      await renderEditor('<p><span style="background-color: #f1e8ce">marked</span></p>')
      expect(screen.getByRole('button', { name: '背景色: 黄' })).toBeInTheDocument()
    })

    it('標準パレットにない色が適用されているときは hex を含む', async () => {
      await renderEditor('<p><span style="background-color: #ff8800">custom</span></p>')
      expect(screen.getByRole('button', { name: '背景色: #ff8800' })).toBeInTheDocument()
    })

    it('色を選び直すと選択後の色名に更新される', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await user.click(screen.getByRole('button', { name: /^背景色/ }))
      await user.click(screen.getByRole('button', { name: '紫' }))

      expect(screen.getByRole('button', { name: '背景色: 紫' })).toBeInTheDocument()
    })

    it('背景色をリセットすると「なし」に戻る', async () => {
      const user = userEvent.setup()
      await renderEditor('<p><span style="background-color: #f1e8ce">marked</span></p>')
      await user.click(screen.getByRole('button', { name: /^背景色/ }))
      await user.click(screen.getByRole('button', { name: '背景色をリセット' }))

      expect(screen.getByRole('button', { name: '背景色: なし' })).toBeInTheDocument()
    })
  })
})

// 待たずに開き直さないのは、色の適用で Tiptap が次のフレームに本文へフォーカスを移し、開き直したパレットが閉じるため
const waitForEditorFocus = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

describe('ColorPickerButton（幅全体に適用）', () => {
  const FEATURES: RichTextFeature[] = [
    'backgroundColor',
    'blockBackgroundColor',
    'bulletList',
    'table',
    'blockquote',
    'codeBlock',
  ]
  const GREEN = '#d5efdf'
  const PURPLE = '#ede2fb'

  const text = (value: string, marks?: JSONContent['marks']): JSONContent => ({
    ...(marks ? { marks } : {}),
    type: 'text',
    text: value,
  })
  const p = (value: string, band?: string, marks?: JSONContent['marks']): JSONContent => ({
    ...(band ? { attrs: { blockBackgroundColor: band } } : {}),
    type: 'paragraph',
    content: [text(value, marks)],
  })
  const doc = (...contentRest: JSONContent[]): RichTextJSON => ({
    type: 'doc',
    content: contentRest,
  })
  const textBackground = (color: string) => [
    { type: 'textStyle', attrs: { backgroundColor: color } },
  ]

  const renderBand = async (content: RichTextJSON, features = FEATURES) => {
    const onChange = vi.fn()
    const ui = (nextFeatures: RichTextFeature[]) => (
      <RichTextEditor
        defaultValue={content}
        features={nextFeatures}
        aria-label="本文"
        onChange={onChange}
      />
    )
    const { rerender } = render(ui(features), { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox', { name: '本文' })).toBeInTheDocument())

    return {
      onChange,
      setFeatures: (nextFeatures: RichTextFeature[]) => rerender(ui(nextFeatures)),
    }
  }
  const getEditor = () =>
    (screen.getByRole('textbox', { name: '本文' }) as TiptapEditorHTMLElement).editor!
  const textPos = (value: string) => {
    let found = -1

    getEditor().state.doc.descendants((node, pos) => {
      if (found === -1 && node.isText && node.text?.includes(value)) {
        found = pos + node.text.indexOf(value)
      }
    })

    if (found === -1) throw new Error(`${value} が見つかりません`)

    return found
  }
  const caretIn = (value: string) =>
    act(() => {
      getEditor().commands.setTextSelection(textPos(value) + 1)
    })
  const selectText = (from: string, to = from) =>
    act(() => {
      getEditor().commands.setTextSelection({ from: textPos(from), to: textPos(to) + to.length })
    })
  const bands = () =>
    getEditor().state.doc.children.map((node) => node.attrs.blockBackgroundColor ?? null)
  const textBackgrounds = () => {
    const colors: string[] = []

    getEditor().state.doc.descendants((node) => {
      node.marks.forEach((mark) => {
        if (mark.attrs.backgroundColor) colors.push(mark.attrs.backgroundColor)
      })
    })

    return colors
  }
  const trigger = () => screen.getByRole('button', { name: /^背景色:/ })
  const checkbox = () => screen.getByRole('checkbox', { name: '幅全体に適用' })

  it('features に blockBackgroundColor が無いと、チェックボックスを出さない', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文')), ['backgroundColor'])
    await caretIn('本文')

    await user.click(trigger())

    expect(screen.getByRole('button', { name: '緑' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('backgroundColor が無く blockBackgroundColor だけでは、背景色のボタンを出さない', async () => {
    await renderBand(doc(p('本文')), ['blockBackgroundColor'])

    expect(screen.queryByRole('button', { name: /^背景色/ })).not.toBeInTheDocument()
  })

  it('マウント後に features へ blockBackgroundColor を足すと、チェックボックスが出る', async () => {
    const user = userEvent.setup()
    const { setFeatures } = await renderBand(doc(p('本文')), ['backgroundColor'])
    setFeatures(FEATURES)
    await caretIn('本文')

    await user.click(trigger())

    expect(checkbox()).toBeInTheDocument()
  })

  it('開いたまま features から blockBackgroundColor を外すと、チェックボックスが消え、色は文字の背景色に付く', async () => {
    const user = userEvent.setup()
    const { setFeatures } = await renderBand(doc(p('本文'), p('後')))
    await selectText('本文')

    await user.click(trigger())
    await user.click(checkbox())
    setFeatures(['backgroundColor'])

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(textBackgrounds()).toEqual([GREEN])
    expect(bands()).toEqual([null, null])
  })

  it('帯の無い段落で開くとチェックは外れていて、チェックを入れて色を選ぶと段落に帯が付き、文字の背景色は付かない', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文'), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    expect(checkbox()).not.toBeChecked()
    await user.click(checkbox())
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(bands()).toEqual([GREEN, null])
    expect(textBackgrounds()).toEqual([])
  })

  it('範囲を選ばずに帯のある段落で開くとチェックが入っていて、そのまま色を選ぶと帯の色が変わる', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文', GREEN), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    expect(checkbox()).toBeChecked()
    await user.click(screen.getByRole('button', { name: '紫' }))

    expect(bands()).toEqual([PURPLE, null])
  })

  it('範囲を選ばずに帯のある段落で開き、リセットすると帯が外れ、文字の背景色は残る', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文', GREEN, textBackground(PURPLE)), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    await user.click(screen.getByRole('button', { name: '背景色をリセット' }))

    expect(bands()).toEqual([null, null])
    expect(textBackgrounds()).toEqual([PURPLE])
  })

  it('帯のある段落の中の文字を範囲で選んで開くとチェックは外れていて、色は文字の背景色になる', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文', GREEN), p('後')))
    await selectText('本文')

    await user.click(trigger())
    expect(checkbox()).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: '紫' }))

    expect(bands()).toEqual([GREEN, null])
    expect(textBackgrounds()).toEqual([PURPLE])
  })

  it('リストの項目の中でチェックを入れて色を選ぶと、リスト全体に帯が付き、項目の段落には付かない', async () => {
    const user = userEvent.setup()
    await renderBand(
      doc({ type: 'bulletList', content: [{ type: 'listItem', content: [p('項目')] }] }, p('後')),
    )
    await caretIn('項目')

    await user.click(trigger())
    await user.click(checkbox())
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(bands()).toEqual([GREEN, null])
    expect(
      getEditor().state.doc.firstChild?.firstChild?.firstChild?.attrs.blockBackgroundColor,
    ).toBeNull()
  })

  it('段落と表にまたがる範囲でチェックを入れて色を選ぶと、段落だけに帯が付き、表は変わらない', async () => {
    const user = userEvent.setup()
    const table: JSONContent = {
      type: 'table',
      content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [p('セル')] }] }],
    }
    await renderBand(doc(p('前'), table, p('後')))
    const cellBefore = JSON.stringify(getEditor().getJSON().content![1])
    await selectText('前', '後')

    await user.click(trigger())
    await user.click(checkbox())
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(bands()).toEqual([GREEN, null, GREEN])
    expect(JSON.stringify(getEditor().getJSON().content![1])).toBe(cellBefore)
  })

  it('表のセルの中ではチェックボックスが押せず、キャレットだけなら色はセルに付く', async () => {
    const user = userEvent.setup()
    await renderBand(
      doc(
        {
          type: 'table',
          content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [p('セル')] }] }],
        },
        p('後'),
      ),
    )
    await caretIn('セル')

    await user.click(trigger())
    expect(checkbox()).toBeDisabled()
    expect(checkbox()).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: '緑' }))

    const cell = getEditor().state.doc.firstChild?.firstChild?.firstChild

    expect(cell?.attrs.backgroundColor).toBe(GREEN)
    expect(bands()).toEqual([null, null])
  })

  it('帯のあるリストの項目の中の表のセルではチェックボックスが押せず、色はセルに付き、リストの帯は変わらない', async () => {
    const user = userEvent.setup()
    const table: JSONContent = {
      type: 'table',
      content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [p('セル')] }] }],
    }
    await renderBand(
      doc(
        {
          type: 'bulletList',
          attrs: { blockBackgroundColor: PURPLE },
          content: [{ type: 'listItem', content: [p('項目'), table] }],
        },
        p('後'),
      ),
    )
    await caretIn('セル')

    await user.click(trigger())
    expect(checkbox()).toBeDisabled()
    expect(checkbox()).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: '緑' }))

    const cell = getEditor().state.doc.firstChild?.firstChild?.child(1).firstChild?.firstChild

    expect(cell?.attrs.backgroundColor).toBe(GREEN)
    expect(bands()).toEqual([PURPLE, null])
  })

  it.each<[string, JSONContent, string]>([
    ['引用', { type: 'blockquote', content: [p('引用')] }, '引用'],
    ['コードブロック', { type: 'codeBlock', content: [text('コード')] }, 'コード'],
  ])(
    '帯のあるリストの項目の中の%sでは、チェックボックスが押せず、色は文字の背景色に付き、リストの帯は変わらない',
    async (_, child, value) => {
      const user = userEvent.setup()
      await renderBand(
        doc(
          {
            type: 'bulletList',
            attrs: { blockBackgroundColor: PURPLE },
            content: [{ type: 'listItem', content: [p('項目'), child] }],
          },
          p('後'),
        ),
      )
      await caretIn(value)

      await user.click(trigger())
      expect(checkbox()).toBeDisabled()
      expect(checkbox()).not.toBeChecked()
      await user.click(screen.getByRole('button', { name: '緑' }))

      expect(trigger()).toHaveAccessibleName('背景色: 緑')
      expect(bands()).toEqual([PURPLE, null])
    },
  )

  it('帯のあるリストの入れ子の項目では、チェックが入っていて、色を選ぶとリスト全体の帯が変わる', async () => {
    const user = userEvent.setup()
    const item = (...contentRest: JSONContent[]): JSONContent => ({
      type: 'listItem',
      content: contentRest,
    })
    await renderBand(
      doc(
        {
          type: 'bulletList',
          attrs: { blockBackgroundColor: PURPLE },
          content: [item(p('親'), { type: 'bulletList', content: [item(p('子'))] })],
        },
        p('後'),
      ),
    )
    await caretIn('子')

    await user.click(trigger())
    expect(checkbox()).toBeEnabled()
    expect(checkbox()).toBeChecked()
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(bands()).toEqual([GREEN, null])
  })

  it('段落の途中から最上位の表のセルの中まで選んでチェックを入れて色を選ぶと、段落に帯が付き、表は変わらない', async () => {
    const user = userEvent.setup()
    const table: JSONContent = {
      type: 'table',
      content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [p('セル')] }] }],
    }
    await renderBand(doc(p('前の段落'), table, p('後')))
    const tableBefore = JSON.stringify(getEditor().getJSON().content![1])
    await selectText('段落', 'セ')

    await user.click(trigger())
    await user.click(checkbox())
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(bands()).toEqual([GREEN, null, null])
    expect(JSON.stringify(getEditor().getJSON().content![1])).toBe(tableBefore)
  })

  it('引用の中ではチェックボックスが押せず、色は文字の背景色になる', async () => {
    const user = userEvent.setup()
    await renderBand(doc({ type: 'blockquote', content: [p('引用')] }, p('後')))
    await selectText('引用')

    await user.click(trigger())
    expect(checkbox()).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(textBackgrounds()).toEqual([GREEN])
    expect(bands()).toEqual([null, null])
  })

  it('チェックを入れ外ししただけでは本文を変えない', async () => {
    const user = userEvent.setup()
    const { onChange } = await renderBand(doc(p('本文'), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    await user.click(checkbox())
    await user.click(checkbox())
    await user.click(checkbox())

    expect(onChange).not.toHaveBeenCalled()
    expect(bands()).toEqual([null, null])
  })

  it('チェックが入っているとき、パレットの選択中の色は帯の色を示す', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文', GREEN, textBackground(PURPLE)), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    expect(screen.getByRole('button', { name: '緑' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '紫' })).toHaveAttribute('aria-pressed', 'false')

    await user.click(checkbox())
    expect(screen.getByRole('button', { name: '紫' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('帯に付けたカスタムの色も、文字の背景色と同じ「最近使った色」に並ぶ', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文', GREEN), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    fireEvent.change(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#123456' },
    })
    await waitForEditorFocus()
    expect(bands()).toEqual(['#123456', null])

    await selectText('後')
    await user.click(trigger())
    expect(checkbox()).not.toBeChecked()
    await user.click(screen.getByRole('button', { name: '履歴：#123456' }))

    expect(textBackgrounds()).toEqual(['#123456'])
  })

  it('末尾の空の段落にだけ帯があるとき、全選択してチェックを入れてリセットすると、その帯も外れる', async () => {
    const user = userEvent.setup()
    await renderBand(
      doc(p('本文', PURPLE), { type: 'paragraph', attrs: { blockBackgroundColor: GREEN } }),
    )
    act(() => {
      getEditor().commands.selectAll()
    })

    await user.click(trigger())
    await user.click(checkbox())
    await user.click(screen.getByRole('button', { name: '背景色をリセット' }))

    expect(bands()).toEqual([null, null])
  })

  it('rgb() 表記の帯と同じ色の 16 進の帯をまたいで開き、チェックを入れると、その色が選ばれている', async () => {
    const user = userEvent.setup()
    await renderBand(doc(p('本文1', 'rgb(213, 239, 223)'), p('本文2', GREEN), p('後')))
    await selectText('本文1', '本文2')

    await user.click(trigger())
    await user.click(checkbox())

    expect(screen.getByRole('button', { name: '緑' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('rgb() 表記の帯の段落で、同じ色を 16 進のパレットから選び直しても、本文を変えない', async () => {
    const user = userEvent.setup()
    const { onChange } = await renderBand(doc(p('本文', 'rgb(213, 239, 223)'), p('後')))
    await caretIn('本文')

    await user.click(trigger())
    expect(checkbox()).toBeChecked()
    await user.click(screen.getByRole('button', { name: '緑' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(bands()).toEqual(['rgb(213, 239, 223)', null])
  })

  it('トリガーのアクセシブル名は帯の色ではなく文字の背景色を示す', async () => {
    await renderBand(doc(p('本文', GREEN), p('後')))
    await caretIn('本文')

    expect(trigger()).toHaveAccessibleName('背景色: なし')
  })

  describe('キーボード', () => {
    const openByKey = async (user: ReturnType<typeof userEvent.setup>) => {
      act(() => trigger().focus())
      await user.keyboard('{Enter}')
    }

    it('開くとチェックボックスにフォーカスし、Tab で最初の色見本へ移る', async () => {
      const user = userEvent.setup()
      await renderBand(doc(p('本文'), p('後')))
      await caretIn('本文')

      await openByKey(user)
      await waitFor(() => expect(checkbox()).toHaveFocus())
      await user.tab()

      expect(screen.getByRole('button', { name: 'グレー' })).toHaveFocus()
    })

    it.each(['ArrowDown', 'ArrowRight'])(
      'チェックボックスで %s を押すと、最初の色見本へ移る',
      async (key) => {
        const user = userEvent.setup()
        await renderBand(doc(p('本文'), p('後')))
        await caretIn('本文')

        await openByKey(user)
        await waitFor(() => expect(checkbox()).toHaveFocus())
        await user.keyboard(`{${key}}`)

        expect(screen.getByRole('button', { name: 'グレー' })).toHaveFocus()
      },
    )

    it.each(['ArrowUp', 'ArrowLeft'])(
      'チェックボックスで %s を押しても、フォーカスは動かず、既定の動作（スクロール）もしない',
      async (key) => {
        const user = userEvent.setup()
        await renderBand(doc(p('本文'), p('後')))
        await caretIn('本文')

        await openByKey(user)
        await waitFor(() => expect(checkbox()).toHaveFocus())
        const notPrevented = fireEvent.keyDown(checkbox(), { key })

        expect(notPrevented).toBe(false)
        expect(checkbox()).toHaveFocus()
      },
    )

    it.each([
      ['Enter', '{Enter}'],
      ['Space', ' '],
      ['↓', '{ArrowDown}'],
    ])('開いたままトリガーで %s を押しても、切り替えたチェックは戻らない', async (_, key) => {
      const user = userEvent.setup()
      await renderBand(doc(p('本文'), p('後')))
      await caretIn('本文')

      await user.click(trigger())
      await user.click(checkbox())
      act(() => trigger().focus())
      await user.keyboard(key)

      await waitFor(() => expect(checkbox()).toHaveFocus())
      expect(checkbox()).toBeChecked()
    })

    it('チェックボックスが押せないときは、開くと最初の色見本にフォーカスする', async () => {
      const user = userEvent.setup()
      await renderBand(doc({ type: 'blockquote', content: [p('引用')] }, p('後')))
      await caretIn('引用')

      await openByKey(user)

      await waitFor(() => expect(screen.getByRole('button', { name: 'グレー' })).toHaveFocus())
    })

    it('チェックボックスから Shift+Tab で閉じてトリガーへ戻る', async () => {
      const user = userEvent.setup()
      await renderBand(doc(p('本文'), p('後')))
      await caretIn('本文')

      await openByKey(user)
      await waitFor(() => expect(checkbox()).toHaveFocus())
      await user.tab({ shift: true })

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      expect(trigger()).toHaveFocus()
    })
  })
})
