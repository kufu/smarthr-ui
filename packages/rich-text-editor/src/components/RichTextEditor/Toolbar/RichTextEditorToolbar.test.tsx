import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextFeature } from '../types'
import type { TiptapEditorHTMLElement } from '@tiptap/core'
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

  it('画像の挿入トリガーはメニューを持つことと開閉状態を伝える', async () => {
    await renderEditor()

    const trigger = screen.getByRole('button', { name: /^画像を挿入/ })

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
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

  describe('項目の幅が変わったときの測り直し', () => {
    const fireResizeOf = (target: Element) => {
      act(() => {
        observers
          .filter(({ targets }) => targets.includes(target))
          .forEach(({ callback }) => callback())
      })
    }

    // 段の直下はボタンを包むツールチップの要素で、監視はその単位で行う
    const itemOf = (button: HTMLElement) =>
      button.closest('.smarthr-ui-RichTextEditor-ToolbarRow > *')!

    const setWidths = (scrollWidth: number) => {
      const toolbar = screen.getByRole('toolbar')
      const row = toolbar.querySelector('.smarthr-ui-RichTextEditor-ToolbarRow')!

      Object.defineProperty(toolbar, 'clientWidth', { value: 100, configurable: true })
      Object.defineProperty(row, 'scrollWidth', { value: scrollWidth, configurable: true })
    }

    // ツールバー本体が描画し直されない変化でも、項目自身の大きさの変化で測り直す
    it('カーソルの移動でラベルだけが変わって幅が増えても、溢れていればトグルを出す', async () => {
      render(
        <RichTextEditor
          features={['bold', 'fontSize']}
          content={{
            format: 'html',
            content: '<p>標準</p><p><span style="font-size: 2rem">大きい</span></p>',
          }}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())
      setWidths(100)
      fireResizeOf(
        screen.getByRole('toolbar').querySelector('.smarthr-ui-RichTextEditor-ToolbarRow')!,
      )
      expect(screen.queryByRole('button', { name: WRAP_TOGGLE_LABEL })).not.toBeInTheDocument()

      const editor = document.querySelector<TiptapEditorHTMLElement>('.ProseMirror')!.editor!
      act(() => {
        editor.commands.setTextSelection(editor.state.doc.content.size - 2)
      })
      const trigger = await screen.findByRole('button', { name: /^フォントサイズ: 32/ })
      setWidths(500)
      fireResizeOf(itemOf(trigger))

      expect(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })).toBeInTheDocument()
    })

    it('後から足した項目の幅の変化も測り直す', async () => {
      const { rerender } = render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

      rerender(<RichTextEditor features={['bold', 'italic']} />)
      const italic = await screen.findByRole('button', { name: '斜体' })
      // 子要素の増減は MutationObserver が非同期に拾う
      await waitFor(() =>
        expect(observers.some(({ targets }) => targets.includes(itemOf(italic)))).toBe(true),
      )
      setWidths(500)
      fireResizeOf(itemOf(italic))

      expect(screen.getByRole('button', { name: WRAP_TOGGLE_LABEL })).toBeInTheDocument()
    })
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
    // コマンドの focus は requestAnimationFrame で遅れて届くため、先に着地させておく。
    // 待たないと、下で項目へ移したフォーカスをキー操作の途中で奪われる
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())

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

  describe('キーボード操作', () => {
    const renderSmallEditor = async () => {
      render(
        <RichTextEditor
          features={['heading', 'bold', 'italic']}
          content={{ format: 'html', content: '<p>本文</p>' }}
        />,
        { wrapper: Wrapper },
      )
      await waitFor(() => expect(screen.getByRole('toolbar')).toBeInTheDocument())

      return document.querySelector<TiptapEditorHTMLElement>('.ProseMirror')!.editor!
    }

    it('Home は無効な項目を飛ばした先頭へ、End は末尾へ移る', async () => {
      const user = userEvent.setup()
      await renderSmallEditor()
      act(() => screen.getByRole('button', { name: '太字' }).focus())

      await user.keyboard('{End}')
      expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus()

      await user.keyboard('{Home}')
      expect(screen.getByRole('button', { name: /^書式:/ })).toHaveFocus()
    })

    it('左右キーは無効な項目を飛ばす', async () => {
      const user = userEvent.setup()
      const editor = await renderSmallEditor()
      act(() => screen.getByRole('button', { name: /^書式:/ }).focus())

      // 先頭の「元に戻す」「やり直す」は無効なので、左で末尾へ折り返す
      await user.keyboard('{ArrowLeft}')
      expect(screen.getByRole('button', { name: '斜体' })).toHaveFocus()

      act(() => {
        editor.commands.insertContent('追記')
      })
      act(() => screen.getByRole('button', { name: '元に戻す' }).focus())

      // 無効な「やり直す」を飛ばす
      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('button', { name: /^書式:/ })).toHaveFocus()
    })

    it('本文で Alt+F10 を押すと、最後にフォーカスしていたツールバーの項目へ移る', async () => {
      const user = userEvent.setup()
      await renderSmallEditor()
      const textbox = screen.getByRole('textbox')

      act(() => textbox.focus())
      await user.keyboard('{Alt>}{F10}{/Alt}')
      expect(screen.getByRole('button', { name: /^書式:/ })).toHaveFocus()

      await user.keyboard('{ArrowRight}')
      await user.keyboard('{Escape}')
      await waitFor(() => expect(textbox).toHaveFocus())

      await user.keyboard('{Alt>}{F10}{/Alt}')
      expect(screen.getByRole('button', { name: '太字' })).toHaveFocus()
    })
  })
})
