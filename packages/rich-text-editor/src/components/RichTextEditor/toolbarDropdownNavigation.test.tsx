import { render, screen, waitFor } from '@testing-library/react'
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

const getTrigger = (name: RegExp) => screen.getByRole('button', { name })

const openByKey = async (
  user: ReturnType<typeof userEvent.setup>,
  name: RegExp,
  key: string,
  role: 'option' | 'menuitem',
) => {
  getTrigger(name).focus()
  await user.keyboard(key)
  // 開いた直後のフォーカスは次のフレームで選択肢へ移る
  await waitFor(() =>
    expect(screen.getAllByRole(role).some((el) => el === document.activeElement)).toBe(true),
  )

  return screen.getAllByRole(role)
}

describe('ツールバーのドロップダウン内のキーボード操作', () => {
  it('縦並びの選択肢は上下キーで移り、端で折り返す。Home と End で両端へ移る', async () => {
    const user = userEvent.setup()
    await renderEditor()

    const options = await openByKey(user, /^書式:/, '{Enter}', 'option')
    const last = options[options.length - 1]
    expect(options[0]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(options[1]).toHaveFocus()

    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(last).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(options[0]).toHaveFocus()

    await user.keyboard('{End}')
    expect(last).toHaveFocus()

    await user.keyboard('{Home}')
    expect(options[0]).toHaveFocus()
  })

  it('トリガーで上キーを押すと、末尾の選択肢にフォーカスして開く', async () => {
    const user = userEvent.setup()
    await renderEditor()

    const options = await openByKey(user, /^書式:/, '{ArrowUp}', 'option')

    expect(options[options.length - 1]).toHaveFocus()
  })

  it('横並びの選択肢は左右キーで移り、上下キーでは移らない', async () => {
    const user = userEvent.setup()
    await renderEditor()

    const options = await openByKey(user, /^テキスト配置:/, '{Enter}', 'option')
    const selected = options.findIndex((el) => el === document.activeElement)
    const next = options[(selected + 1) % options.length]

    await user.keyboard('{ArrowDown}')
    expect(options[selected]).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(next).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(options[selected]).toHaveFocus()

    await user.keyboard('{End}')
    expect(options[options.length - 1]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(options[0]).toHaveFocus()
  })

  it('画像の挿入メニューは上下キーで移り、端で折り返す', async () => {
    const user = userEvent.setup()
    await renderEditor()

    const [upload, url] = await openByKey(user, /^画像を挿入/, '{Enter}', 'menuitem')
    expect(upload).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(url).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(upload).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(url).toHaveFocus()
  })
})
