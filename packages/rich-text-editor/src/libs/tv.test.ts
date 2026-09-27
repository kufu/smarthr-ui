import { describe, expect, it } from 'vitest'

import { tv } from './tv'

const merge = (base: string, className: string) => tv({ base })({ className })

// smarthr-ui 本体の configureTwMerge の各グループと同じ結果になることを確かめる
describe('エディタ専用の tv', () => {
  it.each([
    ['文字色', 'shr-text-black', 'shr-text-grey'],
    ['余白', 'shr-p-1', 'shr-p-0.5'],
    ['幅のトークン', 'shr-w-col1', 'shr-w-col12'],
    ['幅の任意値', 'shr-w-col1', 'shr-w-[10px]'],
    ['flex-basis', 'shr-basis-col2', 'shr-basis-[20%]'],
    ['影', 'shr-shadow-layer-1', 'shr-shadow-layer-3'],
    ['部分の罫線', 'shr-border-shorthand', 'shr-border-t-shorthand'],
    ['フォントサイズ', 'shr-text-base', 'shr-text-sm'],
    ['行送り', 'shr-leading-loose', 'shr-leading-tight'],
    ['重なり順', 'shr-z-overlap', 'shr-z-1'],
    ['フォーカスの表示', 'shr-focus-indicator', 'shr-focus-indicator-none'],
  ])('%s は後から渡したクラスで上書きされる', (_, base, className) => {
    expect(merge(base, className)).toBe(className)
  })

  it('文字色とフォントサイズは別のものとして両方残す', () => {
    expect(merge('shr-text-black shr-text-base', 'shr-text-sm')).toBe('shr-text-black shr-text-sm')
  })
})
