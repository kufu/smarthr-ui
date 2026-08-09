import { tv } from 'tailwind-variants'

const classNameGenerator = tv({
  base: [
    'shr-inline-flex shr-items-center shr-justify-center shr-gap-0.25',
    'shr-h-2 shr-min-w-[theme(spacing.2)]',
    'shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-px-0.5 shr-text-base shr-text-black',
    'hover:shr-bg-white-darken',
    'focus-visible:shr-focus-indicator',
    'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
  ],
})

/** ツールバーのボタン・ドロップダウンのトリガーで共有するスタイル */
export const TOOLBAR_ITEM_CLASS_NAME = classNameGenerator()
