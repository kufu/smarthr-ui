import React, { createContext, useContext, useEffect, useMemo, useRef, useState, } from 'react';
import { useId } from '../../hooks/useId';
import { usePortal } from '../../hooks/usePortal';
import { getFirstTabbable, isEventFromChild } from './dropdownHelper';
const initialRect = { top: 0, right: 0, bottom: 0, left: 0 };
export const DropdownContext = createContext({
    active: false,
    triggerRect: initialRect,
    triggerElementRef: React.createRef(),
    rootTriggerRef: null,
    onClickTrigger: () => {
        /* noop */
    },
    onClickCloser: () => {
        /* noop */
    },
    DropdownContentRoot: () => null,
    contentId: '',
});
export const Dropdown = ({ children }) => {
    const [active, setActive] = useState(false);
    const [triggerRect, setTriggerRect] = useState(initialRect);
    const { rootTriggerRef } = useContext(DropdownContext);
    const { createPortal, portalRoot, isChildPortal, PortalParentProvider } = usePortal();
    const triggerElementRef = useRef(null);
    const contentId = useId();
    if (portalRoot) {
        portalRoot.setAttribute('id', contentId);
    }
    useEffect(() => {
        const onClickBody = (e) => {
            // ignore events from events within DropdownTrigger and DropdownContent
            if (isEventFromChild(e, triggerElementRef.current) || isChildPortal(e.target)) {
                return;
            }
            setActive(false);
        };
        document.body.addEventListener('click', onClickBody, false);
        return () => {
            document.body.removeEventListener('click', onClickBody, false);
        };
    }, [isChildPortal, portalRoot]);
    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot = useMemo(() => (props) => {
        if (!active)
            return null;
        return createPortal(props.children);
    }, [active, createPortal]);
    // set the displayName explicit for DevTools
    DropdownContentRoot.displayName = 'DropdownContentRoot';
    return (React.createElement(PortalParentProvider, null,
        React.createElement(DropdownContext.Provider, { value: {
                active,
                triggerRect,
                triggerElementRef,
                rootTriggerRef: rootTriggerRef || triggerElementRef || null,
                onClickTrigger: (rect) => {
                    const newActive = !active;
                    setActive(newActive);
                    if (newActive)
                        setTriggerRect(rect);
                },
                onClickCloser: () => {
                    setActive(false);
                    // return focus to the Trigger
                    const trigger = getFirstTabbable(triggerElementRef);
                    if (trigger) {
                        trigger.focus();
                    }
                },
                DropdownContentRoot,
                contentId,
            } }, children)));
};
//# sourceMappingURL=Dropdown.js.map