import { tv } from 'tailwind-variants'

const classNameGenerator = tv({
  base: [
    'shr-box-content shr-h-[3px] shr-w-full shr-rounded-full',
    'shr-border shr-border-solid shr-border-[theme(colors.grey.65)]',
  ],
})

/** 文字色・背景色ピッカーのトリガーで現在の色を示す帯 */
export const COLOR_INDICATOR_CLASS_NAME = classNameGenerator()
