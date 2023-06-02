"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusPreviousSibling = exports.focusNextSibling = exports.focusLastSibling = exports.focusFirstSibling = exports.getSiblingButtons = exports.keycodes = exports.getNewExpandedItems = void 0;
const getNewExpandedItems = (prevExpandedItems, itemName, isExpanded, expandableMultiply) => {
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
exports.getNewExpandedItems = getNewExpandedItems;
exports.keycodes = {
    SPACE: 32,
    ENTER: 13,
    HOME: 36,
    END: 35,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
};
const getSiblingButtons = (parent) => {
    return Array.from(parent.querySelectorAll('[data-component="AccordionHeaderButton"]'));
};
exports.getSiblingButtons = getSiblingButtons;
const focusFirstSibling = (parent) => {
    const siblings = (0, exports.getSiblingButtons)(parent);
    const first = siblings[0];
    first.focus();
};
exports.focusFirstSibling = focusFirstSibling;
const focusLastSibling = (parent) => {
    const siblings = (0, exports.getSiblingButtons)(parent);
    const last = siblings[siblings.length - 1];
    last.focus();
};
exports.focusLastSibling = focusLastSibling;
const focusNextSibling = (item, parent) => {
    const siblings = (0, exports.getSiblingButtons)(parent);
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
exports.focusNextSibling = focusNextSibling;
const focusPreviousSibling = (item, parent) => {
    const siblings = (0, exports.getSiblingButtons)(parent);
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
exports.focusPreviousSibling = focusPreviousSibling;
//# sourceMappingURL=accordionPanelHelper.js.map