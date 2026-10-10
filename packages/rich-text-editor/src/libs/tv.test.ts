import { describe, expect, it } from 'vitest'

import { tv } from './tv'

const merge = (base: string, className: string) => tv({ base })({ className })

// smarthr-ui 本体の configureTwMerge の各グループと同じ結果になることを確かめる
describe('エディタ専用の tv', () => {
  it.each([
    ['文字色', 'shr-rte-text-black', 'shr-rte-text-grey'],
    ['余白', 'shr-rte-p-1', 'shr-rte-p-0.5'],
    ['幅のトークン', 'shr-rte-w-col1', 'shr-rte-w-col12'],
    ['幅の任意値', 'shr-rte-w-col1', 'shr-rte-w-[10px]'],
    ['flex-basis', 'shr-rte-basis-col2', 'shr-rte-basis-[20%]'],
    ['影', 'shr-rte-shadow-layer-1', 'shr-rte-shadow-layer-3'],
    ['部分の罫線', 'shr-rte-border-shorthand', 'shr-rte-border-t-shorthand'],
    ['フォントサイズ', 'shr-rte-text-base', 'shr-rte-text-sm'],
    ['行送り', 'shr-rte-leading-loose', 'shr-rte-leading-tight'],
    ['重なり順', 'shr-rte-z-overlap', 'shr-rte-z-1'],
    ['フォーカスの表示', 'shr-rte-focus-indicator', 'shr-rte-focus-indicator-none'],
  ])('%s は後から渡したクラスで上書きされる', (_, base, className) => {
    expect(merge(base, className)).toBe(className)
  })

  it('文字色とフォントサイズは別のものとして両方残す', () => {
    expect(merge('shr-rte-text-black shr-rte-text-base', 'shr-rte-text-sm')).toBe(
      'shr-rte-text-black shr-rte-text-sm',
    )
  })
})
