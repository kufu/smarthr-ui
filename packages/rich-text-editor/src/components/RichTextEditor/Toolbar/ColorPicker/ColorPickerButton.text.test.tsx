import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it } from 'vitest'

import { RichTextEditor } from '../../RichTextEditor/RichTextEditor'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const renderEditor = async (html: string) => {
  render(
    <RichTextEditor features={['color', 'fontSize']} content={{ format: 'html', content: html }} />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

// 色の適用は本文へのフォーカスを Tiptap が次のフレームで行う。待たずに開き直すと、
// 遅れて本文へ移ったフォーカスでパレットが閉じる
const waitForEditorFocus = () => act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

describe('ColorPickerButton（文字色）', () => {
  describe('トリガーのアクセシブル名', () => {
    it('文字色未指定のときは既定色の色名を含む', async () => {
      await renderEditor('<p>plain</p>')
      expect(screen.getByRole('button', { name: '文字色: 黒' })).toBeInTheDocument()
    })

    it('標準パレットの色が適用されているときはその色名を含む', async () => {
      await renderEditor('<p><span style="color: #e01e5a">red</span></p>')
      expect(screen.getByRole('button', { name: '文字色: 赤' })).toBeInTheDocument()
    })

    it('標準パレットにない色が適用されているときは hex を含む', async () => {
      await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
      expect(screen.getByRole('button', { name: '文字色: #ff8800' })).toBeInTheDocument()
    })

    it('色を選び直すと選択後の色名に更新される', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await user.click(screen.getByRole('button', { name: /^文字色/ }))
      await user.click(screen.getByRole('button', { name: '紫' }))

      expect(screen.getByRole('button', { name: '文字色: 紫' })).toBeInTheDocument()
    })

    it('色をリセットすると既定色に戻る', async () => {
      const user = userEvent.setup()
      await renderEditor('<p><span style="color: #e01e5a">red</span></p>')
      await user.click(screen.getByRole('button', { name: /^文字色/ }))
      await user.click(screen.getByRole('button', { name: '色をリセット' }))

      expect(screen.getByRole('button', { name: '文字色: 黒' })).toBeInTheDocument()
    })
  })

  it('文字色未指定のときはパレットの既定色（黒）が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p>plain</p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '黒' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('フォントサイズだけ指定されたHTMLでもパレットの既定色（黒）が選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="font-size: 20px">big</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '黒' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('文字色指定ありのときは既定色が選択状態にならない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #e01e5a">red</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '黒' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: '赤' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('カスタムスウォッチは開始色をラベルに含み、現在の色と一致するとき選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))

    expect(screen.getByRole('button', { name: 'カスタム: #ff8800' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('標準パレットに同じ色があるときはカスタムスウォッチを出さない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #e01e5a">red</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))

    expect(screen.queryByRole('button', { name: /^カスタム/ })).not.toBeInTheDocument()
  })

  it('履歴に同じ色があるときはカスタムスウォッチを出さない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p>plain</p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    fireEvent.change(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#123456' },
    })
    await waitForEditorFocus()

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '履歴: #123456' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^カスタム/ })).not.toBeInTheDocument()
  })

  it('確定せず持ち越した開始色を、カスタムスウォッチから適用できる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p>plain</p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))

    // input だけを起こす。native の change は発火しないため、この時点では適用されない
    fireEvent.input(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#ff8800' },
    })
    expect(screen.getByRole('button', { name: '文字色: 黒' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'カスタム: #ff8800' }))

    expect(screen.getByRole('button', { name: '文字色: #ff8800' })).toBeInTheDocument()
  })

  it('カスタムスウォッチをクリックするとその色が履歴に追加される', async () => {
    const user = userEvent.setup()
    await renderEditor('<p>plain</p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    fireEvent.input(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#ff8800' },
    })
    await user.click(screen.getByRole('button', { name: 'カスタム: #ff8800' }))
    await waitForEditorFocus()

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '履歴: #ff8800' })).toBeInTheDocument()
  })

  it('カラーピッカーで標準の色に無い色を確定すると履歴に追加される', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    fireEvent.change(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#123456' },
    })
    await waitForEditorFocus()

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '履歴: #123456' })).toBeInTheDocument()
  })

  it('カラーピッカーで標準の色と同じ色を確定しても履歴には追加されない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    fireEvent.change(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#e01e5a' },
    })
    await waitForEditorFocus()

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.queryByRole('group', { name: '履歴' })).not.toBeInTheDocument()
  })

  describe('パレットのキーボード操作', () => {
    const openByKey = async (user: ReturnType<typeof userEvent.setup>) => {
      act(() => screen.getByRole('button', { name: /^文字色/ }).focus())
      await user.keyboard('{Enter}')
      // 開いた直後のフォーカスは次のフレームで先頭のスウォッチへ移る
      await waitFor(() => expect(screen.getByRole('button', { name: '黒' })).toHaveFocus())
    }

    it('矢印キーで1行6色の格子を移る', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await openByKey(user)

      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('button', { name: 'グレー' })).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByRole('button', { name: '緑' })).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(screen.getByRole('button', { name: 'グレー' })).toHaveFocus()

      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('button', { name: '黒' })).toHaveFocus()
    })

    it('端では折り返さずに止まる', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await openByKey(user)

      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('button', { name: '黒' })).toHaveFocus()

      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowRight}')
      expect(screen.getByRole('button', { name: 'マゼンタ' })).toHaveFocus()
    })

    it('Escape で閉じてトリガーへ戻る', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await openByKey(user)

      await user.keyboard('{ArrowRight}{Escape}')

      const trigger = screen.getByRole('button', { name: /^文字色/ })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveFocus()
    })

    it('パレットの中でフォーカスが移っても閉じず、外へ移ると閉じる', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await openByKey(user)
      const trigger = screen.getByRole('button', { name: /^文字色/ })

      act(() => screen.getByRole('button', { name: '色をリセット' }).focus())
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      act(() => screen.getByRole('textbox').focus())
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('両端で外へ向けて Tab を押すと閉じてトリガーへ戻る。中へ向けた Tab では閉じない', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await openByKey(user)
      const trigger = screen.getByRole('button', { name: /^文字色/ })
      const first = screen.getByRole('button', { name: '黒' })
      const last = screen.getByRole('button', { name: '色をリセット' })

      expect(fireEvent.keyDown(first, { key: 'Tab' })).toBe(true)
      act(() => last.focus())
      expect(fireEvent.keyDown(last, { key: 'Tab', shiftKey: true })).toBe(true)
      expect(trigger).toHaveAttribute('aria-expanded', 'true')

      expect(fireEvent.keyDown(last, { key: 'Tab' })).toBe(false)
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveFocus()

      await openByKey(user)
      expect(
        fireEvent.keyDown(screen.getByRole('button', { name: '黒' }), {
          key: 'Tab',
          shiftKey: true,
        }),
      ).toBe(false)
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
      expect(trigger).toHaveFocus()
    })

    it('パレットの余白をクリックしても閉じない', async () => {
      const user = userEvent.setup()
      await renderEditor('<p>plain</p>')
      await openByKey(user)

      // フォーカスできない所を押すとフォーカスは body へ移り、パレットの外へ出たように見える
      await user.click(screen.getByText('カスタム', { selector: 'span' }))

      expect(screen.getByRole('button', { name: /^文字色/ })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })
  })
})
