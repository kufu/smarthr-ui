import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { getIconComponent, getItemStyle } from './appNaviHelper';
export var AppNaviButton = function (_a) {
    var children = _a.children, icon = _a.icon, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.isUnclickable, isUnclickable = _c === void 0 ? false : _c, onClick = _a.onClick;
    var theme = useTheme();
    var iconComponent = getIconComponent(theme, { icon: icon, current: current });
    return (React.createElement(Button, { themes: theme, "aria-current": current ? 'page' : undefined, onClick: onClick, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable },
        iconComponent,
        children));
};
var Button = styled.button(function (props) { return getItemStyle(props); });
//# sourceMappingURL=AppNaviButton.js.map