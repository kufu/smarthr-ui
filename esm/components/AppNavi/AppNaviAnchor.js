import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { getIconComponent, getItemStyle } from './appNaviHelper';
import { useClassNames } from './useClassNames';
export const AppNaviAnchor = ({ children, href, icon, current = false, isUnclickable = false, }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const iconComponent = getIconComponent(theme, { icon, current });
    return (React.createElement(Anchor, { themes: theme, "aria-current": current ? 'page' : undefined, href: isUnclickable ? undefined : href, isActive: current, isUnclickable: isUnclickable, className: classNames.anchor },
        iconComponent,
        children));
};
const Anchor = styled.a((props) => getItemStyle(props));
//# sourceMappingURL=AppNaviAnchor.js.map