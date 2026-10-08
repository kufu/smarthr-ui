import { tv } from '../../../libs/tv'

const classNameGenerator = tv({
  base: [
    // align-middle が無いと inline-flex のベースラインが中身に左右される。
    // 空の色スウォッチを持つ背景色トリガーだけ行ボックスが伸び、2px ずれていた。
    'shr-rte-inline-flex shr-rte-items-center shr-rte-justify-center shr-rte-gap-0.25 shr-rte-align-middle',
    'shr-rte-h-2 shr-rte-min-w-[theme(spacing.2)]',
    'shr-rte-cursor-pointer shr-rte-rounded-m shr-rte-border-none shr-rte-bg-transparent shr-rte-px-0.5 shr-rte-text-base shr-rte-text-black',
    'hover:shr-rte-bg-white-darken',
    'focus-visible:shr-rte-focus-indicator',
    'disabled:shr-rte-cursor-default disabled:shr-rte-text-disabled disabled:hover:shr-rte-bg-transparent',
  ],
})

/** ツールバーのボタン・ドロップダウンのトリガーで共有するスタイル */
export const TOOLBAR_ITEM_CLASS_NAME = classNameGenerator()

/** ツールバーから開くポップアップの外枠で共有するスタイル */
export const TOOLBAR_POPUP_CLASS_NAME =
  'shr-rte-border-shorthand shr-rte-rounded-m shr-rte-bg-white shr-rte-p-1 shr-rte-shadow-layer-3'
