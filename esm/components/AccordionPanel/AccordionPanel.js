import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flatArrayToMap } from '../../libs/map';
import { focusFirstSibling, focusLastSibling, focusNextSibling, focusPreviousSibling, getNewExpandedItems, keycodes, } from './accordionPanelHelper';
import { useClassNames } from './useClassNames';
export const AccordionPanelContext = React.createContext({
    iconPosition: 'left',
    displayIcon: true,
    expandedItems: new Map(),
    expandableMultiply: false,
    parentRef: null,
});
export const AccordionPanel = ({ children, iconPosition = 'left', displayIcon = true, expandableMultiply = false, defaultExpanded = [], className = '', onClick: onClickProps, ...props }) => {
    const [expandedItems, setExpanded] = useState(flatArrayToMap(defaultExpanded));
    const parentRef = useRef(null);
    const classNames = useClassNames();
    const onClickTrigger = useCallback((itemName, isExpanded) => {
        setExpanded(getNewExpandedItems(expandedItems, itemName, isExpanded, expandableMultiply));
    }, [expandableMultiply, expandedItems]);
    const handleKeyPress = (event) => {
        if (!parentRef?.current) {
            return;
        }
        const keyCode = event.keyCode;
        const item = event.target;
        switch (keyCode) {
            case keycodes.HOME: {
                event.preventDefault();
                focusFirstSibling(parentRef.current);
                break;
            }
            case keycodes.END: {
                event.preventDefault();
                focusLastSibling(parentRef.current);
                break;
            }
            case keycodes.LEFT:
            case keycodes.UP: {
                event.preventDefault();
                focusPreviousSibling(item, parentRef.current);
                break;
            }
            case keycodes.RIGHT:
            case keycodes.DOWN: {
                event.preventDefault();
                focusNextSibling(item, parentRef.current);
                break;
            }
        }
    };
    useEffect(() => {
        if (defaultExpanded.length > 0)
            setExpanded(flatArrayToMap(defaultExpanded));
    }, [defaultExpanded]);
    return (React.createElement(AccordionPanelContext.Provider, { value: {
            onClickTrigger,
            onClickProps,
            expandedItems,
            iconPosition,
            displayIcon,
            expandableMultiply,
            parentRef,
        } },
        React.createElement("div", { ...props, className: `${className} ${classNames.wrapper}`, ref: parentRef, onKeyDown: handleKeyPress }, children)));
};
//# sourceMappingURL=AccordionPanel.js.map