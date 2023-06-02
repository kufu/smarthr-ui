import styled, { css } from 'styled-components';
import { useSpacing } from '../../../hooks/useSpacing';
export const Sidebar = styled.div(({ align = 'stretch', contentsMinWidth = '50%', gap = 1, right }) => {
    const isGapSeparate = gap instanceof Object;
    const gapValue = isGapSeparate
        ? css `
          row-gap: ${useSpacing(gap.row)};
          column-gap: ${useSpacing(gap.column)};
        `
        : css `
          gap: ${useSpacing(gap)};
        `;
    const sidebarValue = css `
      flex-grow: 1;
    `;
    const mainContentsValue = css `
      flex-basis: 0;
      flex-grow: 999;
      min-width: ${contentsMinWidth};
    `;
    return css `
      display: flex;
      flex-wrap: wrap;
      align-items: ${align};
      ${gapValue}

      & > *:last-child {
        ${right ? sidebarValue : mainContentsValue}
      }

      & > *:first-child {
        ${right ? mainContentsValue : sidebarValue}
      }

      /* 
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
      */
      &:empty {
        gap: 0;
      }
    `;
});
//# sourceMappingURL=Sidebar.js.map