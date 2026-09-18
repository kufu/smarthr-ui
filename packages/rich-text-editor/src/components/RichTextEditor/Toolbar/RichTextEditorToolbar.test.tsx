import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextFeature } from '../types'
import type { ReactNode } from 'react'

// 段以外を監視しているコールバック（画像や表の位置追従）を巻き込まないよう絞り込む
type FakeObserver = { callback: () => void; targets: Element[] }

const observers: FakeObserver[] = []

beforeAll(() => {
  globalThis.ResizeObserver = class {
    private observed: FakeObserver

    constructor(callback: () => void) {
      this.observed = { callback, targets: [] }
      observers.push(this.observed)
    }

    observe(target: Element) {
      this.observed.targets.push(target)
    }

    unobserve() {}

    disconnect() {
      this.observed.targets.length = 0
    }
  } as unknown as typeof ResizeObserver
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

// jsdom はレイアウトしないため、判定に使う2つの値を差し替えて測り直させる
const setRowOverflowing = (overflowing: boolean) => {
  const toolbar = document.querySelector('.smarthr-ui-RichTextEditor-Toolbar')!
  const row = document.querySelector('.smarthr-ui-RichTextEditor-ToolbarRow')!

  Object.defineProperty(toolbar, 'clientWidth', { value: 100, configurable: true })
  Object.defineProperty(row, 'scrollWidth', {
    value: overflowing ? 500 : 100,
    configurable: true,
  })

  act(() => {
    observers.filter(({ targets }) => targets.includes(row)).forEach(({ callback }) => callback())
  })
}

const WRAP_TOGGLE_LABEL = '折り返して表示'

const tabStopsOf = (toolbar: HTMLElement) =>
  within(toolbar)
    .getAllByRole('button')
    .filter((button) => button.getAttribute('tabindex') === '0')

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

  it('デスクトップではホバーするとツールチップを描画する', async () => {
    await renderEditor()

    await userEvent.hover(screen.getByRole('button', { name: '太字' }))

    // ボタンの aria-label はテキストノードではないため、getByText はツールチップ本体だけに一致する
    expect(screen.getByText('太字')).toBeInTheDocument()
  })

  it('モバイルではツールチップを描画しない', async () => {
    await renderMobileEditor()

    await userEvent.hover(screen.getByRole('button', { name: '太字' }))

    expect(screen.queryByText('太字')).not.toBeInTheDocument()
    // ボタン自体は aria-label で見つかる（支援技術への情報は失われていない）
    expect(screen.getByRole('button', { name: '太字' })).toBeInTheDocument()
  })

  it('段が溢れていなければ折り返しトグルを表示しない', async () => {
    await renderEditor()

    expect(screen.queryByRole('button', { name: WRAP_TOGGLE_LABEL })).not.toBeInTheDocument()
  })

  it('段が溢れているとき折り返しトグルを表示し、初期状態は横スクロールになる', async () => {
    await renderEditor()

    setRowOverflowing(true)

    expect(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('折り返しトグルを押すと折り返し表示になり、もう一度押すと横スクロールに戻る', async () => {
    await renderEditor()
    setRowOverflowing(true)

    const toggle = screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  it('横スクロール中も折り返し中も、すべての項目を描画する', async () => {
    await renderEditor()
    setRowOverflowing(true)

    expect(screen.getByRole('button', { name: '水平線' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL }))

    expect(screen.getByRole('button', { name: '水平線' })).toBeInTheDocument()
  })

  it('折り返しを切り替えてもトグルにフォーカスが残る', async () => {
    await renderEditor()
    setRowOverflowing(true)

    const toggle = screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })

    await userEvent.click(toggle)

    expect(toggle).toHaveFocus()
  })

  it('折り返し中は溢れを測り直さないため、トグルが消えない', async () => {
    await renderEditor()
    setRowOverflowing(true)

    await userEvent.click(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL }))

    setRowOverflowing(false)

    // 測定は毎コミット走るため、折り返し中の早期returnが無いとここでトグルが消える
    await userEvent.click(screen.getByRole('button', { name: '太字' }))

    expect(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })).toBeInTheDocument()
  })

  it('トグルが占有する幅は溢れの判定に含めない', async () => {
    await renderEditor()

    const toolbar = screen.getByRole('toolbar')
    const row = toolbar.querySelector('.smarthr-ui-RichTextEditor-ToolbarRow')!

    Object.defineProperty(toolbar, 'clientWidth', { value: 100, configurable: true })
    Object.defineProperty(row, 'scrollWidth', { value: 500, configurable: true })

    act(() => {
      observers.filter(({ targets }) => targets.includes(row)).forEach(({ callback }) => callback())
    })

    expect(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })).toBeInTheDocument()

    Object.defineProperty(row, 'clientWidth', { value: 60, configurable: true })
    Object.defineProperty(row, 'scrollWidth', { value: 80, configurable: true })

    act(() => {
      observers.filter(({ targets }) => targets.includes(row)).forEach(({ callback }) => callback())
    })

    // 段の幅(60)には収まらないが、ツールバーの内寸(100)には収まるためトグルは不要
    expect(screen.queryByRole('button', { name: WRAP_TOGGLE_LABEL })).not.toBeInTheDocument()
  })

  it('disabled のときトグルも disabled になる', async () => {
    render(<RichTextEditor disabled features={ALL_FEATURES} />, { wrapper: Wrapper })
    await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

    setRowOverflowing(true)

    expect(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })).toBeDisabled()
  })

  it('右キーで末尾の項目からトグルへ移動し、トグルからは先頭（元に戻す）へラップする', async () => {
    await renderEditor()
    setRowOverflowing(true)

    // 初期状態は undo が disabled のため、まず「水平線」を挿入して履歴を1件積み、undo を有効にする。
    // undo（index 0）が有効な状態でラップアラウンドを検証しないと、トグルの分だけ count が
    // 1つ小さいバグ（disabledFlagsからトグルの要素が抜けている）があっても、探索順の先頭付近に
    // ある disabled な項目群にたまたま行き当たって同じ結果になり、バグを見逃してしまう
    await userEvent.click(screen.getByRole('button', { name: '水平線' }))

    const toggle = screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })
    // DOM順は段の項目→トグルなので、トグルの直前にある要素を「末尾の項目」として取得する
    const toolbarButtons = within(screen.getByRole('toolbar')).getAllByRole('button')
    const lastItem = toolbarButtons[toolbarButtons.indexOf(toggle) - 1]

    lastItem.focus()
    await userEvent.keyboard('{ArrowRight}')

    expect(toggle).toHaveFocus()

    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('button', { name: '元に戻す' })).toHaveFocus()
  })

  it('溢れが解消してトグルが消えても、Tabで到達できる項目が1つ残る', async () => {
    await renderEditor()
    setRowOverflowing(true)

    act(() => screen.getByRole('button', { name: WRAP_TOGGLE_LABEL }).focus())

    expect(tabStopsOf(screen.getByRole('toolbar'))).toHaveLength(1)

    setRowOverflowing(false)

    expect(screen.queryByRole('button', { name: WRAP_TOGGLE_LABEL })).not.toBeInTheDocument()
    expect(tabStopsOf(screen.getByRole('toolbar'))).toHaveLength(1)
  })
})
