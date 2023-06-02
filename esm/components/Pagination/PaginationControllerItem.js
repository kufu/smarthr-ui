import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaAngleDoubleLeftIcon, FaAngleDoubleRightIcon, FaChevronLeftIcon, FaChevronRightIcon, } from '../Icon';
import { ItemButton } from './PaginationItem';
const getIconProps = (direction, double) => {
    return direction === 'prev'
        ? double
            ? { Icon: FaAngleDoubleLeftIcon, alt: '最初へ' }
            : { Icon: FaChevronLeftIcon, alt: '前へ' }
        : double
            ? { Icon: FaAngleDoubleRightIcon, alt: '最後へ' }
            : { Icon: FaChevronRightIcon, alt: '次へ' };
};
export const PaginationControllerItem = ({ direction, disabled, double = false, targetPage, onClick, }) => {
    const theme = useTheme();
    const { Icon, ...iconProps } = getIconProps(direction, double);
    return (React.createElement(ItemButton, { onClick: () => onClick(targetPage), disabled: disabled, themes: theme, "aria-label": iconProps.alt },
        React.createElement(Icon, { color: disabled ? theme.color.TEXT_DISABLED : theme.color.TEXT_BLACK, alt: iconProps.alt })));
};
//# sourceMappingURL=PaginationControllerItem.js.map