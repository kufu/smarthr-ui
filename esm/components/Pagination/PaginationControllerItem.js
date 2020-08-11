import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { ItemButton } from './PaginationItem';
import { Icon } from '../Icon';
export var PaginationControllerItem = function (_a) {
    var direction = _a.direction, disabled = _a.disabled, double = _a.double, targetPage = _a.targetPage, onClick = _a.onClick;
    var theme = useTheme();
    return (React.createElement(ItemButton, { square: true, size: "s", className: "paginationItem", onClick: function () { return onClick(targetPage); }, disabled: disabled, themes: theme },
        React.createElement(Icon, { name: direction === 'prev'
                ? double
                    ? 'fa-angle-double-left'
                    : 'fa-chevron-left'
                : double
                    ? 'fa-angle-double-right'
                    : 'fa-chevron-right', color: disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK, size: 13 })));
};
//# sourceMappingURL=PaginationControllerItem.js.map