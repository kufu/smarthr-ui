import { useTheme } from '../../hooks/useTheme';
export const useReelShadow = ({ showShadow = true, direction = 'left' }) => {
    const theme = useTheme();
    const shadowWidth = theme.space(0.75);
    return `
    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      left: ${direction === 'left' ? '0' : `-${shadowWidth}`};
      width: ${shadowWidth};
      pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
      background: linear-gradient(${direction === 'left' ? '90deg' : '-90deg'}, rgba(0, 0, 0, 0.2) 0%, transparent 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `;
};
//# sourceMappingURL=useReelShadow.js.map