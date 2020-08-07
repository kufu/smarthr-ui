import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { getIconComponent, getItemStyle } from './appNaviHelper';
export var AppNaviAnchor = function (_a) {
    var children = _a.children, href = _a.href, icon = _a.icon, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.isUnclickable, isUnclickable = _c === void 0 ? false : _c;
    var theme = useTheme();
    var iconComponent = getIconComponent(theme, { icon: icon, current: current });
    return (React.createElement(Anchor, { themes: theme, "aria-current": current ? 'page' : undefined, href: isUnclickable ? undefined : href, isActive: current, isUnclickable: isUnclickable },
        iconComponent,
        children));
};
var Anchor = styled.a(function (props) { return getItemStyle(props); });
//# sourceMappingURL=AppNaviAnchor.js.map