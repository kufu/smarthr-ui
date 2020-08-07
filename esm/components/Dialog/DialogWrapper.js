import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
export var DialogContext = createContext({
    onClickTrigger: function () {
        /* noop */
    },
    onClickClose: function () {
        /* noop */
    },
    DialogContentRoot: function () { return null; },
    active: false,
});
export var DialogWrapper = function (_a) {
    var children = _a.children;
    var _b = useState(false), active = _b[0], setActive = _b[1];
    var element = useRef(document.createElement('div')).current;
    useEffect(function () {
        document.body.appendChild(element);
        return function () {
            document.body.removeChild(element);
        };
    }, [element]);
    // This is the root container of a dialog content located in outside the DOM tree
    var DialogContentRoot = useMemo(function () { return function (props) {
        return createPortal(props.children, element);
    }; }, [element]);
    // set the displayName explicit for DevTools
    DialogContentRoot.displayName = 'DialogContentRoot';
    return (React.createElement(DialogContext.Provider, { value: {
            onClickTrigger: function () { return setActive(true); },
            onClickClose: function () { return setActive(false); },
            DialogContentRoot: DialogContentRoot,
            active: active,
        } }, children));
};
//# sourceMappingURL=DialogWrapper.js.map