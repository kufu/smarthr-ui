import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export const UnstyledButton = styled.button `
  ${() => {
    const { shadow } = useTheme();
    return css `
      appearance: none;
      display: inline;
      align-items: stretch;
      overflow: visible;
      cursor: auto;
      padding: 0;
      border-style: none;
      border-width: medium;
      border-color: currentColor;
      /* stylelint-disable declaration-block-no-redundant-longhand-properties */
      border-image-source: none;
      border-image-slice: 100%;
      border-image-width: 1;
      border-image-outset: 0;
      border-image-repeat: stretch;
      /* stylelint-enable declaration-block-no-redundant-longhand-properties */
      box-sizing: content-box;
      background-color: transparent;
      background-image: none;
      background-origin: padding-box;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      text-align: left;
      user-select: auto;
      zoom: auto;

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
    `;
}}
`;
//# sourceMappingURL=UnstyledButton.js.map