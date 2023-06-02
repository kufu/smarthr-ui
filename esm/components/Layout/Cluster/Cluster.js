import styled, { css } from 'styled-components';
import { useSpacing } from '../../../hooks/useSpacing';
export const Cluster = styled.div(({ gap = 0.5, align, justify, inline }) => {
    const rowGap = gap instanceof Object ? useSpacing(gap.row) : useSpacing(gap);
    const columnGap = gap instanceof Object ? useSpacing(gap.column) : useSpacing(gap);
    return css `
    display: ${inline ? 'inline-flex' : 'flex'};
    flex-wrap: wrap;
    ${align && `align-items: ${align};`}
    ${justify && `justify-content: ${justify};`}
    row-gap: ${rowGap};
    column-gap: ${columnGap};

    /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
    */
    &:empty {
      gap: 0;
    }
  `;
});
//# sourceMappingURL=Cluster.js.map