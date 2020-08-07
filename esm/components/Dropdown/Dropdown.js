import React, { createContext, useEffect, useMemo, useRef, useState, } from 'react';
import { createPortal } from 'react-dom';
import { hasParentElement } from './dropdownHelper';
var initialRect = { top: 0, right: 0, bottom: 0, left: 0 };
export var DropdownContext = createContext({
    active: false,
    triggerRect: initialRect,
    triggerElementRef: React.createRef(),
    onClickTrigger: function () {
        /* noop */
    },
    onClickCloser: function () {
        /* noop */
    },
    DropdownContentRoot: function () { return null; },
});
export var Dropdown = function (_a) {
    var children = _a.children;
    var _b = useState(false), active = _b[0], setActive = _b[1];
    var _c = useState(initialRect), triggerRect = _c[0], setTriggerRect = _c[1];
    var portalElementRef = useRef(document.createElement('div'));
    var triggerElementRef = useRef(null);
    useEffect(function () {
        var onClickBody = function (e) {
            // ignore events from events within DropdownTrigger and DropdownContent
            if (e.target === triggerElementRef.current ||
                hasParentElement(e.target, portalElementRef.current)) {
                return;
            }
            setActive(false);
        };
        var portalElement = portalElementRef.current;
        document.body.appendChild(portalElement);
        document.body.addEventListener('click', onClickBody, false);
        return function () {
            document.body.removeChild(portalElement);
            document.body.removeEventListener('click', onClickBody, false);
        };
    }, []);
    // This is the root container of a dropdown content located in outside the DOM tree
    var DropdownContentRoot = useMemo(function () { return function (props) {
        if (!active)
            return null;
        return createPortal(props.children, portalElementRef.current);
    }; }, [active]);
    // set the displayName explicit for DevTools
    DropdownContentRoot.displayName = 'DropdownContentRoot';
    return (React.createElement(DropdownContext.Provider, { value: {
            active: active,
            triggerRect: triggerRect,
            triggerElementRef: triggerElementRef,
            onClickTrigger: function (rect) {
                var newActive = !active;
                setActive(newActive);
                if (newActive)
                    setTriggerRect(rect);
            },
            onClickCloser: function () {
                setActive(false);
            },
            DropdownContentRoot: DropdownContentRoot,
        } }, children));
};
//# sourceMappingURL=Dropdown.js.map