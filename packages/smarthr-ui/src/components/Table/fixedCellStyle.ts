import { tv } from 'tailwind-variants'

export const fixedCellStyle = tv({
  base: [
    'smarthr-ui-TableCell-fixed',
    'shr-sticky shr-bg-white',

    'after:shr-absolute after:shr-top-0 after:shr-z-0 after:shr-h-full after:shr-w-0.75 after:shr-from-[rgba(0,0,0,0.2)] after:shr-to-transparent after:shr-transition-all after:shr-duration-200 after:shr-content-[""] after:shr-visible',
    /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
    'after:shr-pointer-events-none',

    '[&.smarthr-ui-TableCell-fixed]:shr-left-[var(--prev-width)]',
    '[&:has(+:not(.smarthr-ui-TableCell-fixed))]:after:shr-left-full [&:has(+:not(.smarthr-ui-TableCell-fixed))]:after:shr-bg-gradient-to-r',

    '[&.smarthr-ui-TableCell-fixed]:shr-right-[var(--next-width)]',
    '[:not(.smarthr-ui-TableCell-fixed)+&.smarthr-ui-TableCell-fixed]:after:shr-right-full [:not(.smarthr-ui-TableCell-fixed)+&.smarthr-ui-TableCell-fixed]:after:shr-bg-gradient-to-l',

    '[.smarthr-ui-TableReel-scroll-reached-start_&:has(+:not(.smarthr-ui-TableCell-fixed))]:after:shr-opacity-0',
    '[.smarthr-ui-TableReel-scroll-reached-end_:not(.smarthr-ui-TableCell-fixed)+&.smarthr-ui-TableCell-fixed]:after:shr-opacity-0',
  ],
})
