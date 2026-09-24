import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'smarthr-ui'
import { describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor/RichTextEditor'
import { ALL_FEATURES } from './extensions/configureExtensions'

import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const renderEditor = async () => {
  render(<RichTextEditor features={[...ALL_FEATURES]} onImageUpload={vi.fn()} />, {
    wrapper: Wrapper,
  })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

const TRIGGERS = [
  /^書式:/,
  /^フォントサイズ:/,
  /^行送り:/,
  /^文字色:/,
  /^背景色:/,
  /^テキスト配置:/,
  /^リンク/,
  /^テーブルを挿入/,
  /^YouTube動画を埋め込む/,
  /^画像を挿入/,
]

const getTrigger = (name: RegExp) => screen.getByRole('button', { name })

const openByClick = async (user: ReturnType<typeof userEvent.setup>, name: RegExp) => {
  await user.click(getTrigger(name))
  expect(getTrigger(name)).toHaveAttribute('aria-expanded', 'true')
  // マウスで開いた直後の状態を作る。入力欄を持つポップオーバーは次のフレームで
  // 入力欄へフォーカスを移すため、それを待ってからトリガーへ戻す
  await act(() => new Promise((resolve) => requestAnimationFrame(resolve)))
  getTrigger(name).focus()
}

describe('ツールバーのドロップダウンを閉じる操作', () => {
  it.each(TRIGGERS)('%s: トリガー上の Escape で閉じ、フォーカスはトリガーに残る', async (name) => {
    const user = userEvent.setup()
    await renderEditor()

    await openByClick(user, name)
    await user.keyboard('{Escape}')

    expect(getTrigger(name)).toHaveAttribute('aria-expanded', 'false')
    expect(getTrigger(name)).toHaveFocus()
  })

  it('閉じたあとの Escape はツールバーから本文へ戻す', async () => {
    const user = userEvent.setup()
    await renderEditor()

    await openByClick(user, /^書式:/)
    await user.keyboard('{Escape}')
    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())
  })

  it.each(TRIGGERS)('%s: 矢印キーで隣のボタンへ移ると閉じる', async (name) => {
    const user = userEvent.setup()
    await renderEditor()

    await openByClick(user, name)
    await user.keyboard('{ArrowRight}')

    expect(getTrigger(name)).not.toHaveFocus()
    expect(getTrigger(name)).toHaveAttribute('aria-expanded', 'false')
  })
})
