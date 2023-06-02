import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { UnstyledButton } from '../Button';
import { getIconComponent, getItemStyle } from './appNaviHelper';
import { useClassNames } from './useClassNames';
export const AppNaviButton = ({ children, icon, current = false, isUnclickable = false, onClick, }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const iconComponent = getIconComponent(theme, { icon, current });
    return (React.createElement(Button, { themes: theme, "aria-current": current ? 'page' : undefined, onClick: onClick, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable, type: "button", className: classNames.button },
        iconComponent,
        children));
};
const Button = styled(UnstyledButton)((props) => getItemStyle(props));
//# sourceMappingURL=AppNaviButton.js.map