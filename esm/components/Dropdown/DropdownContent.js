import React, { useContext } from 'react';
import { DropdownContext } from './Dropdown';
import { DropdownContentInner } from './DropdownContentInner';
export var DropdownContentContext = React.createContext({
    onClickCloser: function () {
        /* noop */
    },
    controllable: false,
    scrollable: true,
});
export var DropdownContent = function (_a) {
    var _b = _a.controllable, controllable = _b === void 0 ? false : _b, _c = _a.scrollable, scrollable = _c === void 0 ? true : _c, _d = _a.className, className = _d === void 0 ? '' : _d, children = _a.children;
    var _e = useContext(DropdownContext), DropdownContentRoot = _e.DropdownContentRoot, triggerRect = _e.triggerRect, onClickCloser = _e.onClickCloser;
    return (React.createElement(DropdownContentRoot, null,
        React.createElement(DropdownContentContext.Provider, { value: { onClickCloser: onClickCloser, controllable: controllable, scrollable: scrollable } },
            React.createElement(DropdownContentInner, { triggerRect: triggerRect, scrollable: scrollable, className: className, controllable: controllable }, children))));
};
//# sourceMappingURL=DropdownContent.js.map