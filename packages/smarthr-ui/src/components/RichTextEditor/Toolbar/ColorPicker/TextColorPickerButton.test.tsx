import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { IntlProvider } from '../../../../intl'
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

describe('TextColorPickerButton', () => {
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

  it('カスタムスウォッチは現在のカスタム色をラベルに含むボタンとして操作できる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: 'カスタム: #ff8800' })).toBeInTheDocument()
  })

  it('カスタム色が現在の文字色と一致するときだけカスタムスウォッチが選択状態になる', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: 'カスタム: #ff8800' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('button', { name: '赤' }))
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: 'カスタム: #e01e5a' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('カスタムスウォッチをクリックするとその色が履歴に追加される', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    await user.click(screen.getByRole('button', { name: 'カスタム: #ff8800' }))

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.getByRole('button', { name: '履歴: #ff8800' })).toBeInTheDocument()
  })

  it('標準の色と同じカスタム色をクリックしても履歴には追加されない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #e01e5a">red</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    await user.click(screen.getByRole('button', { name: 'カスタム: #e01e5a' }))

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.queryByRole('group', { name: '履歴' })).not.toBeInTheDocument()
  })

  it('カラーピッカーで標準の色と同じ色を確定しても履歴には追加されない', async () => {
    const user = userEvent.setup()
    await renderEditor('<p><span style="color: #ff8800">custom</span></p>')
    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    fireEvent.change(document.querySelector('input[name="customColor"]')!, {
      target: { value: '#e01e5a' },
    })

    await user.click(screen.getByRole('button', { name: /^文字色/ }))
    expect(screen.queryByRole('group', { name: '履歴' })).not.toBeInTheDocument()
  })
})
