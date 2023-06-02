import React from 'react';
import { css } from 'styled-components';
export const getIconComponent = (theme, options) => {
    const opts = {
        icon: null,
        current: false,
        ...options,
    };
    const { TEXT_BLACK, TEXT_GREY } = theme.color;
    if (!opts.icon)
        return null;
    const Icon = opts.icon;
    const iconProps = {
        color: opts.current ? TEXT_BLACK : TEXT_GREY,
    };
    return React.createElement(Icon, { ...iconProps });
};
export const getItemStyle = ({ themes: { color: { hoverColor, MAIN, TEXT_BLACK, TEXT_GREY, WHITE }, fontSize, leading, spacingByChar, }, isActive, isUnclickable, }) => css `
    display: flex;
    align-items: center;
    gap: ${spacingByChar(0.5)};
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    border: none;
    background-color: transparent;
    padding: ${spacingByChar(0.75)} ${spacingByChar(0.5)};
    text-decoration: none;
    font-size: ${fontSize.M};
    font-weight: bold;
    line-height: ${leading.NONE};
    color: ${TEXT_GREY};
    white-space: nowrap;

    ${isActive &&
    css `
      color: ${TEXT_BLACK};
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        display: block;
        background-color: ${MAIN};
        height: ${spacingByChar(0.25)};
      }
    `}
    ${!isUnclickable &&
    css `
      cursor: pointer;
      &:hover {
        background-color: ${hoverColor(WHITE)};
      }
    `}
  `;
//# sourceMappingURL=appNaviHelper.js.map