import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { BaseButton, BaseButtonAnchor, } from './BaseButton';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `TextButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
export const TextButton = ({ type = 'button', className = '', ...props }) => {
    const theme = useTheme();
    const { textButton } = useClassNames();
    return (React.createElement(TextStyleButton, { ...props, themes: theme, type: type, className: `${className} ${textButton.wrapper}` }));
};
/**
 * @deprecated `TextButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
export const TextButtonAnchor = ({ className = '', ...props }) => {
    const theme = useTheme();
    const { textButtonAnchor } = useClassNames();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    React.createElement(TextStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${textButtonAnchor.wrapper}` }));
};
const textStyle = css `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      background-color: transparent;
      color: ${color.TEXT_BLACK};

      &:focus-visible,
      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    `;
}}
`;
const disabledStyle = css `
  ${({ themes: { color } }) => css `
    background-color: transparent;
    color: ${color.disableColor(color.TEXT_DISABLED)};
  `}
`;
const TextStyleButton = styled(BaseButton) `
  ${textStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const TextStyleButtonAnchor = styled(BaseButtonAnchor) `
  ${textStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=TextButton.js.map