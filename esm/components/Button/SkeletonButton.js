import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { BaseButton, BaseButtonAnchor } from './BaseButton';
import { useClassNames } from './useClassNames';
/**
 * @deprecated `SkeletonButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
export const SkeletonButton = ({ type = 'button', className = '', ...props }) => {
    const theme = useTheme();
    const { skeletonButton } = useClassNames();
    return (React.createElement(SkeletonStyleButton, { ...props, themes: theme, type: type, className: `${className} ${skeletonButton.wrapper}` }));
};
/**
 * @deprecated `SkeletonButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
export const SkeletonButtonAnchor = ({ className = '', ...props }) => {
    const theme = useTheme();
    const { skeletonButtonAnchor } = useClassNames();
    return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    React.createElement(SkeletonStyleButtonAnchor, { ...props, themes: theme, className: `${className} ${skeletonButtonAnchor.wrapper}` }));
};
const skeletonStyle = css `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      border-color: ${color.WHITE};
      background-color: transparent;
      color: ${color.TEXT_WHITE};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.WHITE)};
        background-color: ${color.OVERLAY};
        color: ${color.hoverColor(color.TEXT_WHITE)};
      }
    `;
}}
`;
const disabledStyle = css `
  ${({ themes: { color } }) => css `
    border-color: ${color.disableColor(color.WHITE)};
    background-color: transparent;
    color: ${color.disableColor(color.TEXT_WHITE)};
  `}
`;
const SkeletonStyleButton = styled(BaseButton) `
  ${skeletonStyle}
  &[disabled] {
    ${disabledStyle}
  }
`;
const SkeletonStyleButtonAnchor = styled(BaseButtonAnchor) `
  ${skeletonStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`;
//# sourceMappingURL=SkeletonButton.js.map