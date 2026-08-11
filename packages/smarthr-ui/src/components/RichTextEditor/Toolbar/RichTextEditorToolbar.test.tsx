import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it } from 'vitest'

import { EnvironmentProvider } from '../../../hooks/useEnvironment'
import { IntlProvider } from '../../../intl'
import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextFeature } from '../types'
import type { ReactNode } from 'react'

beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }
})

const ALL_FEATURES: RichTextFeature[] = [
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
]

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const MobileWrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider environment={{ mobile: true }}>{children}</EnvironmentProvider>
  </IntlProvider>
)

const renderEditor = async () => {
  render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: Wrapper })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

const renderMobileEditor = async () => {
  render(<RichTextEditor features={ALL_FEATURES} />, { wrapper: MobileWrapper })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())
}

const heightClassNamesOf = (el: HTMLElement) =>
  Array.from(el.classList).filter((className) => /^shr-h-/.test(className))

describe('RichTextEditorToolbar', () => {
  it('ツールバーの操作要素のクリック領域の高さが全項目で揃っている', async () => {
    await renderEditor()

    const items = within(screen.getByRole('toolbar')).getAllByRole('button')
    expect(items.length).toBe(ALL_FEATURES.length + 2) // features + 履歴操作（元に戻す・やり直す）

    const heightClassNames = items.map((item) => heightClassNamesOf(item))
    // 高さを明示していないと利用側の line-height でクリック領域の高さが変わるため、全項目で高さを固定する
    expect(heightClassNames.every((classNames) => classNames.length === 1)).toBe(true)
    expect(new Set(heightClassNames.map(([className]) => className)).size).toBe(1)
  })

  it('デスクトップではツールチップを描画する', async () => {
    await renderEditor()

    // ボタンの aria-label はテキストノードではないため、getByText はツールチップ本体だけに一致する
    expect(screen.getByText('太字')).toBeInTheDocument()
  })

  it('モバイルではツールチップを描画しない', async () => {
    await renderMobileEditor()

    // 段に overflow-x を付けるとツールチップがクリップされ縦スクロールが生じるため描画しない
    expect(screen.queryByText('太字')).not.toBeInTheDocument()
    // ボタン自体は aria-label で見つかる（支援技術への情報は失われていない）
    expect(screen.getByRole('button', { name: '太字' })).toBeInTheDocument()
  })

  it('デスクトップでは開閉トグルを表示しない', async () => {
    await renderEditor()

    expect(screen.queryByRole('button', { name: 'その他の書式' })).not.toBeInTheDocument()
  })

  it('モバイルでは開閉トグルを表示し、初期状態は閉じている', async () => {
    await renderMobileEditor()

    expect(screen.getByRole('button', { name: 'その他の書式' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    // 2段目の項目（挿入系）は閉じている間は描画しない
    expect(screen.queryByRole('button', { name: '水平線' })).not.toBeInTheDocument()
  })

  it('モバイルでトグルを押すと2段目が現れ、もう一度押すと消える', async () => {
    await renderMobileEditor()

    const toggle = screen.getByRole('button', { name: 'その他の書式' })

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: '水平線' })).toBeInTheDocument()

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: '水平線' })).not.toBeInTheDocument()
  })

  it('モバイルで2段目を閉じたときトグルにフォーカスが残る', async () => {
    await renderMobileEditor()

    const toggle = screen.getByRole('button', { name: 'その他の書式' })

    await userEvent.click(toggle)
    await userEvent.click(toggle)

    expect(toggle).toHaveFocus()
  })

  it('モバイルでトグルの aria-controls が2段目の要素を指す', async () => {
    await renderMobileEditor()

    const toggle = screen.getByRole('button', { name: 'その他の書式' })
    await userEvent.click(toggle)

    const secondaryId = toggle.getAttribute('aria-controls')
    expect(secondaryId).toBeTruthy()

    const secondaryRow = document.getElementById(secondaryId!)
    expect(secondaryRow).toBeInTheDocument()
    // 2段目の中に挿入系の項目が入っている
    expect(within(secondaryRow!).getByRole('button', { name: '水平線' })).toBeInTheDocument()
  })

  it('2段目に入る項目が無い features ではトグルを表示しない', async () => {
    // bold は decoration グループなので1段目のみになる
    render(<RichTextEditor features={['bold']} />, { wrapper: MobileWrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    expect(screen.queryByRole('button', { name: 'その他の書式' })).not.toBeInTheDocument()
  })

  it('disabled のときトグルも disabled になる', async () => {
    render(<RichTextEditor features={ALL_FEATURES} disabled />, { wrapper: MobileWrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    expect(screen.getByRole('button', { name: 'その他の書式' })).toBeDisabled()
  })

  it('右キーで1段目末尾からトグル、さらに2段目先頭へ移動する', async () => {
    await renderMobileEditor()

    const toggle = screen.getByRole('button', { name: 'その他の書式' })
    // 2段目を開く。DOM順は1段目→トグル→2段目なので、ツールバー全体のボタン列から
    // トグルの直前にある要素を「1段目末尾」として取得する（ラベルをハードコードしない）
    await userEvent.click(toggle)

    const toolbarButtons = within(screen.getByRole('toolbar')).getAllByRole('button')
    const lastPrimaryItem = toolbarButtons[toolbarButtons.indexOf(toggle) - 1]

    lastPrimaryItem.focus()
    await userEvent.keyboard('{ArrowRight}')

    // 1段目末尾 → トグル
    expect(toggle).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')

    // トグル → 2段目先頭。semantics グループの先頭は link（features の指定順ではなくグループ定義順で決まる）
    expect(screen.getByRole('button', { name: 'リンク' })).toHaveFocus()
  })

  it('2段目末尾から右キーを押すと1段目先頭（元に戻す）へラップし、2段目先頭から左キーを押すとトグルへ戻る', async () => {
    await renderMobileEditor()

    const toggle = screen.getByRole('button', { name: 'その他の書式' })
    await userEvent.click(toggle)

    // 初期状態は undo が disabled のため、まず「水平線」を挿入して履歴を1件積み、undo を有効にする。
    // undo（index 0）が有効な状態でラップアラウンドを検証しないと、トグルの分だけ count が
    // 1つ小さいバグ（disabledFlagsからトグルの要素が抜けている）があっても、探索順の先頭付近に
    // ある disabled な項目群にたまたま行き当たって同じ結果になり、バグを見逃してしまう
    await userEvent.click(screen.getByRole('button', { name: '水平線' }))

    const secondaryId = toggle.getAttribute('aria-controls')
    const secondaryRow = document.getElementById(secondaryId!)!
    const secondaryButtons = within(secondaryRow).getAllByRole('button')

    // トグルが disabledFlags の1要素を占有していないと count が1つ小さくなり、
    // ラップアラウンドの探索順がずれて undo より先に別の項目（見出しドロップダウン）へ着地する
    secondaryButtons[secondaryButtons.length - 1].focus()
    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('button', { name: '元に戻す' })).toHaveFocus()

    secondaryButtons[0].focus()
    await userEvent.keyboard('{ArrowLeft}')

    expect(toggle).toHaveFocus()
  })
})
