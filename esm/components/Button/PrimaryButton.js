import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { BaseButton, BaseButtonAnchor } from './BaseButton';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `PrimaryButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
export const PrimaryButton = ({ type = 'button', className = '', ...props }) => {
    const theme = useTheme();
    const { primaryButton } = useClassNames();
    return (React.createElement(PrimaryStyleButton, { ...props, themes: theme, type: type, className: `${className} ${primaryButton.wrapper}` }));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
PrimaryButton.displayName = 'PrimaryButton';
/**
 * @deprecated `PrimaryButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
export const PrimaryButtonAnchor = ({ className = '', ...props }) => {
    const theme = useTheme();
    const { primaryButtonAnchor } = useClassNames();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    React.createElement(PrimaryStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${primaryButtonAnchor.wrapper}` }));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
PrimaryButtonAnchor.displayName = 'PrimaryButtonAnchor';
const primaryStyle = css `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      border-color: ${color.MAIN};
      background-color: ${color.MAIN};
      color: ${color.TEXT_WHITE};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.MAIN)};
        background-color: ${color.hoverColor(color.MAIN)};
        color: ${color.TEXT_WHITE};
      }
    `;
}}
`;
const disabledStyle = css `
  ${({ themes: { color } }) => css `
    border-color: ${color.disableColor(color.MAIN)};
    background-color: ${color.disableColor(color.MAIN)};
    color: ${color.disableColor(color.TEXT_WHITE)};
  `}
`;
const PrimaryStyleButton = styled(BaseButton) `
  ${primaryStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const PrimaryStyleButtonAnchor = styled(BaseButtonAnchor) `
  ${primaryStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=PrimaryButton.js.map