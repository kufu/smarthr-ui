import { tv } from 'tailwind-variants'

export const reelShadowStyle = tv({
  base: [
    'after:shr-absolute after:shr-top-0 after:shr-z-0 after:shr-h-full after:shr-w-0.75 after:shr-from-[rgba(0,0,0,0.2)] after:shr-to-transparent after:shr-transition-opacity after:shr-duration-200 after:shr-content-[""]',
    /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
    'after:shr-pointer-events-none',
  ],
  variants: {
    showShadow: {
      true: 'after:shr-opacity-100',
      false: 'after:shr-opacity-0',
    },
    direction: {
      left: 'after:shr-left-0 after:shr-bg-gradient-to-r',
      right: 'after:shr-right-full after:shr-bg-gradient-to-l',
    },
  },
})
