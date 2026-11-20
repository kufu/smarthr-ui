import { tv } from 'tailwind-variants'

// TODO: showShadow=falseでもafter要素はopacity-0で存在し続けているため、
// テキスト選択(範囲選択)時に干渉する可能性がある。visibility:hidden +
// transition-visibility + delayに変更し、非表示時はhit-testの対象外にしたい
export const reelShadowClassNameGenerator = tv({
  base: [
    'after:shr-absolute after:shr-top-0 after:shr-z-0 after:shr-h-full after:shr-w-0.75 after:shr-from-[rgba(0,0,0,0.2)] after:shr-to-transparent after:shr-transition-opacity after:shr-duration-200 after:shr-content-[""]',
    /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
    'after:shr-pointer-events-none',
    'after:shr-opacity-0',
    'data-[smarthr-ui-shadow=true]:after:shr-opacity-100',
    '[&.fixed]:shr-sticky [&.fixed]:after:shr-opacity-100',
  ],
  variants: {
    direction: {
      left: 'after:shr-left-full after:shr-bg-gradient-to-r',
      right: 'after:shr-right-full after:shr-bg-gradient-to-l',
    },
  },
})
