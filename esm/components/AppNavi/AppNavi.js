import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { StatusLabel as StatusLabelComponent } from '../StatusLabel';
import { AppNaviAnchor } from './AppNaviAnchor';
import { AppNaviButton } from './AppNaviButton';
import { AppNaviCustomTag } from './AppNaviCustomTag';
import { AppNaviDropdown } from './AppNaviDropdown';
import { useClassNames } from './useClassNames';
export const AppNavi = ({ label, buttons, isCurrentUnclickable, className = '', children = null, displayDropdownCaret = false, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` },
        label && (React.createElement(StatusLabel, { themes: theme, className: classNames.label }, label)),
        buttons && (React.createElement(Buttons, { themes: theme, className: classNames.buttons }, buttons.map((button, i) => {
            const isUnclickable = button.current && isCurrentUnclickable;
            if ('tag' in button) {
                const { tag, icon, current, children: buttonChildren, ...buttonProps } = button;
                return (React.createElement("li", { key: i, className: classNames.listItem },
                    React.createElement(AppNaviCustomTag, { ...buttonProps, tag: tag, icon: icon, current: current, isUnclickable: isUnclickable }, buttonChildren)));
            }
            if ('href' in button) {
                return (React.createElement("li", { key: i, className: classNames.listItem },
                    React.createElement(AppNaviAnchor, { href: button.href, icon: button.icon, current: button.current, isUnclickable: isUnclickable }, button.children)));
            }
            if ('dropdownContent' in button) {
                return (React.createElement("li", { key: i, className: classNames.listItem },
                    React.createElement(AppNaviDropdown, { dropdownContent: button.dropdownContent, icon: button.icon, current: button.current, isUnclickable: isUnclickable, displayCaret: displayDropdownCaret }, button.children)));
            }
            return (React.createElement("li", { key: i, className: classNames.listItem },
                React.createElement(AppNaviButton, { icon: button.icon, current: button.current, onClick: button.onClick, isUnclickable: isUnclickable }, button.children)));
        }))),
        children));
};
const Wrapper = styled.nav `
  ${({ themes: { color, shadow, spacingByChar } }) => {
    return css `
      display: flex;
      align-items: center;
      min-width: max-content;
      box-shadow: ${shadow.LAYER1};
      background-color: ${color.WHITE};
      padding-right: ${spacingByChar(1.5)};
      padding-left: ${spacingByChar(1.5)};
    `;
}}
`;
const StatusLabel = styled(StatusLabelComponent) `
  ${({ themes: { spacingByChar } }) => {
    return css `
      margin-right: ${spacingByChar(1)};
    `;
}}
`;
const Buttons = styled.ul `
  ${({ themes: { spacingByChar } }) => {
    return css `
      align-self: stretch;
      display: flex;
      align-items: stretch;
      gap: ${spacingByChar(1)};
      margin: 0;
      padding: 0;

      > li {
        list-style: none;
      }
    `;
}}
`;
//# sourceMappingURL=AppNavi.js.map