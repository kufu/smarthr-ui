import styled, { css } from 'styled-components';
import { useSpacing } from '../../../hooks/useSpacing';
export const Reel = styled.div(({ gap = 0.5, padding = 0 }) => css `
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    gap: ${useSpacing(gap)};
    padding: ${useSpacing(padding)};

    & > * {
      flex: 0 0 auto;
    }

    /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
    */
    &:empty {
      gap: 0;
    }
  `);
//# sourceMappingURL=Reel.js.map