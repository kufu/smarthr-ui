import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown';
import { FaCaretDownIcon } from '../Icon';
import { getIconComponent, getItemStyle } from './appNaviHelper';
export const AppNaviDropdown = ({ children, dropdownContent, icon, current = false, isUnclickable = false, displayCaret, }) => {
    const theme = useTheme();
    const iconComponent = getIconComponent(theme, { icon, current });
    return (React.createElement(Dropdown, null,
        React.createElement(StyledDropdownTrigger, null,
            React.createElement(TriggerButton, { themes: theme, "aria-current": current ? 'page' : undefined, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable, type: "button", displayCaret: displayCaret },
                iconComponent,
                children,
                displayCaret && React.createElement(FaCaretDownIcon, null))),
        React.createElement(DropdownContent, null, dropdownContent)));
};
const StyledDropdownTrigger = styled(DropdownTrigger) `
  height: 100%;
`;
const TriggerButton = styled.button(({ displayCaret, ...props }) => css `
    ${getItemStyle(props)}

    ${displayCaret &&
    css `
      &[aria-expanded='true'] {
        .smarthr-ui-Icon:last-child {
          transform: rotate(0.5turn);
        }
      }
    `}
  `);
//# sourceMappingURL=AppNaviDropdown.js.map