import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { TextLink } from '../TextLink';
export const HeaderLink = styled(TextLink).attrs({ target: '_blank', suffix: null }) `
  ${() => {
    const { color, shadow, spacingByChar } = useTheme();
    return css `
      padding-inline: ${spacingByChar(0.25)};
      color: ${color.TEXT_WHITE};
      box-shadow: unset;

      &:hover {
        color: ${color.TEXT_WHITE};
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }
    `;
}}
`;
//# sourceMappingURL=HeaderLink.js.map