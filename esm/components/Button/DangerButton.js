import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { BaseButton, BaseButtonAnchor } from './BaseButton';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `DangerButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
export const DangerButton = ({ type = 'button', className = '', ...props }) => {
    const theme = useTheme();
    const { dangerButton } = useClassNames();
    return (React.createElement(DangerStyleButton, { ...props, themes: theme, type: type, className: `${className} ${dangerButton.wrapper}` }));
};
/**
 * @deprecated `DangerButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
export const DangerButtonAnchor = ({ className = '', ...props }) => {
    const theme = useTheme();
    const { dangerButtonAnchor } = useClassNames();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    React.createElement(DangerStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${dangerButtonAnchor.wrapper}` }));
};
const dangerStyle = css `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      border-color: ${color.DANGER};
      background-color: ${color.DANGER};
      color: ${color.TEXT_WHITE};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.DANGER)};
        background-color: ${color.hoverColor(color.DANGER)};
      }
    `;
}}
`;
const disabledStyle = css `
  ${({ themes: { color } }) => css `
    border-color: ${color.disableColor(color.DANGER)};
    background-color: ${color.disableColor(color.DANGER)};
    color: ${color.disableColor(color.TEXT_WHITE)};
  `}
`;
const DangerStyleButton = styled(BaseButton) `
  ${dangerStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const DangerStyleButtonAnchor = styled(BaseButtonAnchor) `
  ${dangerStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=DangerButton.js.map