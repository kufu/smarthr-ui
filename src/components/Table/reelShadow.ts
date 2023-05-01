type ReelShadow = {
  showShadow?: boolean
  direction?: 'left' | 'right'
}

export const reelShadow = ({ showShadow = true, direction = 'left' }: ReelShadow) => {
  const shadowWidth = '12px' //影の横幅はpx指定で固定とする

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
      }, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `
}
