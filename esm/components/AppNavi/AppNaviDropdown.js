import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown';
import { getIconComponent, getItemStyle } from './appNaviHelper';
export var AppNaviDropdown = function (_a) {
    var children = _a.children, dropdownContent = _a.dropdownContent, icon = _a.icon, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.isUnclickable, isUnclickable = _c === void 0 ? false : _c;
    var theme = useTheme();
    var iconComponent = getIconComponent(theme, { icon: icon, current: current });
    return (React.createElement(Dropdown, null,
        React.createElement(DropdownTrigger, null,
            React.createElement(TriggerButton, { themes: theme, "aria-current": current ? 'page' : undefined, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable },
                iconComponent,
                children)),
        React.createElement(DropdownContent, null, dropdownContent)));
};
var TriggerButton = styled.button(function (props) { return getItemStyle(props); });
//# sourceMappingURL=AppNaviDropdown.js.map