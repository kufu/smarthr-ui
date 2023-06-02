import React, { useContext } from 'react';
import { DropdownContext } from './Dropdown';
import { DropdownContentInner } from './DropdownContentInner';
import { useClassNames } from './useClassNames';
export const DropdownContentContext = React.createContext({
    onClickCloser: () => {
        /* noop */
    },
    controllable: false,
    scrollable: true,
});
export const DropdownContent = ({ controllable = false, scrollable = true, className = '', children, ...props }) => {
    const { DropdownContentRoot, triggerRect, onClickCloser } = useContext(DropdownContext);
    const classNames = useClassNames();
    return (React.createElement(DropdownContentRoot, null,
        React.createElement(DropdownContentContext.Provider, { value: { onClickCloser, controllable, scrollable } },
            React.createElement(DropdownContentInner, { ...props, triggerRect: triggerRect, scrollable: scrollable, className: `${className} ${classNames.content}`, controllable: controllable }, children))));
};
//# sourceMappingURL=DropdownContent.js.map