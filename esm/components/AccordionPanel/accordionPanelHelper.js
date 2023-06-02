export const getNewExpandedItems = (prevExpandedItems, itemName, isExpanded, expandableMultiply) => {
    let newState;
    if (expandableMultiply) {
        newState = new Map(prevExpandedItems);
        isExpanded ? newState.set(itemName, itemName) : newState.delete(itemName);
    }
    else {
        newState = isExpanded ? new Map([[itemName, itemName]]) : new Map();
    }
    return newState;
};
export const keycodes = {
    SPACE: 32,
    ENTER: 13,
    HOME: 36,
    END: 35,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
};
export const getSiblingButtons = (parent) => {
    return Array.from(parent.querySelectorAll('[data-component="AccordionHeaderButton"]'));
};
export const focusFirstSibling = (parent) => {
    const siblings = getSiblingButtons(parent);
    const first = siblings[0];
    first.focus();
};
export const focusLastSibling = (parent) => {
    const siblings = getSiblingButtons(parent);
    const last = siblings[siblings.length - 1];
    last.focus();
};
export const focusNextSibling = (item, parent) => {
    const siblings = getSiblingButtons(parent);
    const current = siblings.indexOf(item);
    if (current === siblings.length - 1) {
        const first = siblings[0];
        first.focus();
    }
    else if (current !== -1) {
        const next = siblings[current + 1];
        next.focus();
    }
};
export const focusPreviousSibling = (item, parent) => {
    const siblings = getSiblingButtons(parent);
    const current = siblings.indexOf(item);
    if (current === 0) {
        const last = siblings[siblings.length - 1];
        last.focus();
    }
    else if (current !== -1) {
        const previous = siblings[current - 1];
        previous.focus();
    }
};
//# sourceMappingURL=accordionPanelHelper.js.map