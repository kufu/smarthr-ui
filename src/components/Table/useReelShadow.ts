import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'

type ReelShadow = {
  showShadow?: boolean
  direction?: 'left' | 'right'
}

export const useReelShadow = ({ showShadow = true, direction = 'left' }: ReelShadow) => {
  const theme = useTheme()
  const shadowWidth = theme.space(0.75)

  return `
    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      left: ${direction === 'left' ? '0' : `-${shadowWidth}`};
      width: ${shadowWidth};
      pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
      background: linear-gradient(${
        direction === 'left' ? '90deg' : '-90deg'
      }, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `
}

export const reelShadowStyle = tv({
  base: [
    "after:shr-content-['']",
    'after:shr-absolute',
    'after:shr-z-0',
    'after:shr-top-0',
    'after:shr-h-full',
    'after:shr-pointer-events-none' /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */,
    'after:shr-w-0.75',
    'after:shr-from-[rgba(0,0,0,0.2)]',
    'after:shr-to-transparent',
    'after:shr-transition-opacity',
    'after:shr-duration-200',
  ],
  variants: {
    showShadow: {
      true: 'after:shr-opacity-100',
      false: 'after:shr-opacity-0',
    },
    direction: {
      left: ['after:shr-left-0', 'after:shr-bg-gradient-to-r'],
      right: ['after:shr-right-full', 'after:shr-bg-gradient-to-l'],
    },
  },
})
