import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { getIconComponent, getItemStyle } from './appNaviHelper';
import { useClassNames } from './useClassNames';
export const AppNaviCustomTag = ({ children, tag, icon, current = false, isUnclickable = false, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const iconComponent = getIconComponent(theme, { icon, current });
    if (current) {
        if (isUnclickable) {
            const unclickableProps = { href: undefined, disabled: true };
            return (React.createElement(UnclickableActive, { ...props, ...unclickableProps, as: tag, "$themes": theme, "aria-current": "page", className: classNames.customTag },
                iconComponent,
                children));
        }
        return (React.createElement(Active, { ...props, as: tag, "$themes": theme, "aria-current": "page", className: classNames.customTag },
            iconComponent,
            children));
    }
    return (React.createElement(InActive, { ...props, as: tag, "$themes": theme, className: classNames.customTag },
        iconComponent,
        children));
};
const Active = styled.div(({ $themes }) => getItemStyle({ themes: $themes, isActive: true }));
const InActive = styled.div(({ $themes }) => getItemStyle({ themes: $themes }));
const UnclickableActive = styled.div(({ $themes }) => getItemStyle({ themes: $themes, isActive: true, isUnclickable: true }));
//# sourceMappingURL=AppNaviCustomTag.js.map