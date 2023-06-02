import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export const SpreadsheetTableCorner = styled.th(() => {
    const { color, leading, space } = useTheme();
    return css `
    position: relative;

    &::before {
      content: '';
      position: absolute;
      right: calc(${space(0.25)} / 2);
      bottom: calc(${space(0.25)} / 2);
      display: block;
      background-color: ${color.ACTION_BACKGROUND};
      padding: calc(${space(0.25)} / 2);
      clip-path: polygon(0 100%, 100% 0, 100% 100%);
      width: calc(1em * ${leading.NORMAL});
      height: calc(1em * ${leading.NORMAL});
    }
  `;
});
//# sourceMappingURL=SpreadsheetTableCorner.js.map