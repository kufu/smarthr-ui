import { render, screen, waitFor } from '@testing-library/react'
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
    <RichTextEditor features={['backgroundColor']} content={{ format: 'html', content: html }} />,
    { wrapper: Wrapper },
  )
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

describe('BackgroundColorPickerButton', () => {
  describe('トリガーのアクセシブル名', () => {
    it('背景色未指定のときは「なし」を含む', async () => {
      await renderEditor('<p>plain</p>')
      expect(screen.getByRole('button', { name: '背景色: なし' })).toBeInTheDocument()
    })

    it('標準パレットの色が適用されているときはその色名を含む', async () => {
      await renderEditor('<p><span style="background-color: #fbf3c4">marked</span></p>')
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
      await renderEditor('<p><span style="background-color: #fbf3c4">marked</span></p>')
      await user.click(screen.getByRole('button', { name: /^背景色/ }))
      await user.click(screen.getByRole('button', { name: '背景色をリセット' }))

      expect(screen.getByRole('button', { name: '背景色: なし' })).toBeInTheDocument()
    })
  })
})
