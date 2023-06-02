import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { BaseButton, BaseButtonAnchor } from './BaseButton';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `SecondaryButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
export const SecondaryButton = ({ type = 'button', className = '', ...props }) => {
    const theme = useTheme();
    const { secondaryButton } = useClassNames();
    return (React.createElement(SecondaryStyleButton, { ...props, themes: theme, type: type, className: `${className} ${secondaryButton.wrapper}` }));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButton.displayName = 'SecondaryButton';
/**
 * @deprecated `SecondaryButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
export const SecondaryButtonAnchor = ({ className = '', ...props }) => {
    const theme = useTheme();
    const { secondaryButtonAnchor } = useClassNames();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    React.createElement(SecondaryStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${secondaryButtonAnchor.wrapper}` }));
};
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButtonAnchor.displayName = 'SecondaryButtonAnchor';
const secondaryStyle = css `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      border-color: ${color.BORDER};
      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    `;
}}
`;
const disabledStyle = css `
  ${({ themes: { color } }) => css `
    border-color: ${color.disableColor(color.BORDER)};
    background-color: ${color.disableColor(color.WHITE)};
    color: ${color.TEXT_DISABLED};
  `}
`;
const SecondaryStyleButton = styled(BaseButton) `
  ${secondaryStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const SecondaryStyleButtonAnchor = styled(BaseButtonAnchor) `
  ${secondaryStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=SecondaryButton.js.map