import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { useToolbarDropdown } from './useToolbarDropdown'

import type { FC } from 'react'

type HarnessProps = {
  /** ツールバー内の段をスクロールコンテナにするか */
  scrollableRow?: boolean
  /** ツールバーの外側にスクロールコンテナを置くか（Dialog の本文などを模したもの） */
  scrollableOutside?: boolean
}

// スクロールコンテナの判定は getComputedStyle を見るため、jsdom でも効くインラインスタイルで作る
// （Tailwind のクラスは jsdom に CSS が読み込まれず overflow が visible のままになる）
const Harness: FC<HarnessProps> = ({ scrollableRow = true, scrollableOutside = false }) => {
  const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()

  const toolbar = (
    <div role="toolbar" aria-label="書式設定" aria-orientation="horizontal">
      <div data-testid="row" style={scrollableRow ? { overflowX: 'auto' } : undefined}>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          開く
        </button>
      </div>
    </div>
  )

  return (
    <div data-testid="outside" style={scrollableOutside ? { overflowY: 'auto' } : undefined}>
      {toolbar}
      {renderDropdown(
        <div role="listbox">
          <button type="button" role="option" aria-selected="false">
            項目
          </button>
        </div>,
      )}
    </div>
  )
}

const openDropdown = async (props: HarnessProps = {}) => {
  render(<Harness {...props} />)
  await userEvent.click(screen.getByRole('button', { name: '開く' }))
  expect(screen.getByRole('listbox')).toBeInTheDocument()
}

// jsdom はレイアウトしないため scrollLeft への代入が反映されない。スクロール位置を差し替えた
// うえで scroll を発火し、実際にスクロールが起きた状態と同じ入力をハンドラへ与える
const scrollBy = (el: HTMLElement, offset: { left?: number; top?: number }) => {
  if (offset.left !== undefined) {
    Object.defineProperty(el, 'scrollLeft', { value: offset.left, configurable: true })
  }
  if (offset.top !== undefined) {
    Object.defineProperty(el, 'scrollTop', { value: offset.top, configurable: true })
  }
  fireEvent.scroll(el)
}

describe('useToolbarDropdown', () => {
  it('トリガーを内包する段がスクロールしたらドロップダウンを閉じる', async () => {
    await openDropdown()

    // 座標は開いた時点で1度だけ算出するため、閉じないとトリガーから離れた位置に取り残される
    scrollBy(screen.getByTestId('row'), { left: 250 })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開く' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('ツールバーの外側にあるスクロールコンテナのスクロールでは閉じない', async () => {
    // 段自体はスクロールせず、ツールバーの外側だけがスクロールコンテナという構成。
    // Dialog の本文（DialogBody の Scroller）や ModelessDialog に置いた場合がこれに当たる。
    // 祖先を無制限に遡ると購読先が利用者側のツリー次第になり、デスクトップでも
    // ダイアログ本文のスクロールで閉じてしまう（入力欄を持つものは入力中の値まで失う）
    await openDropdown({ scrollableRow: false, scrollableOutside: true })

    scrollBy(screen.getByTestId('outside'), { top: 250 })

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開く' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('外側にスクロールコンテナがあっても、段のスクロールでは閉じる', async () => {
    // 境界を入れたことで段の購読まで止まっていないことを、外側と段の両方がスクロール
    // コンテナである構成で確かめる
    await openDropdown({ scrollableRow: true, scrollableOutside: true })

    scrollBy(screen.getByTestId('row'), { left: 250 })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('スクロール位置が開いた時点から動いていなければ閉じない', async () => {
    await openDropdown()

    // トリガーへの focus() が起こす scroll-into-view は購読開始より後に届きうる。
    // これで閉じてしまうと、開いた直後に勝手に閉じる
    fireEvent.scroll(screen.getByTestId('row'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('スクロールコンテナがどこにも無ければスクロールで閉じない', async () => {
    await openDropdown({ scrollableRow: false })

    // ページスクロールで座標が追従しないのはこのhookの全利用者に共通の既存挙動であり、
    // この修正の対象外
    fireEvent.scroll(document)
    fireEvent.scroll(screen.getByTestId('row'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('フォーカスがドロップダウン内にあるときはスクロールで閉じたあとトリガーへ戻す', async () => {
    await openDropdown()

    screen.getByRole('option').focus()

    scrollBy(screen.getByTestId('row'), { left: 250 })

    expect(screen.getByRole('button', { name: '開く' })).toHaveFocus()
  })

  it('フォーカスがドロップダウン外にあるときはスクロールで閉じてもフォーカスを奪わない', async () => {
    await openDropdown()

    // 指でスクロールしただけの場面。ここでトリガーへ focus() するとスクロール位置が
    // 引き戻され、スクロール操作と喧嘩する
    ;(document.activeElement as HTMLElement | null)?.blur()

    scrollBy(screen.getByTestId('row'), { left: 250 })

    expect(screen.getByRole('button', { name: '開く' })).not.toHaveFocus()
  })
})
