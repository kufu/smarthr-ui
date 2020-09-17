"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewExpandedItems = void 0;
exports.getNewExpandedItems = function (prevExpandedItems, itemName, isExpanded, expandableMultiply) {
    var newState;
    if (expandableMultiply) {
        newState = new Map(prevExpandedItems);
        isExpanded ? newState.set(itemName, itemName) : newState.delete(itemName);
    }
    else {
        newState = isExpanded ? new Map([[itemName, itemName]]) : new Map();
    }
    return newState;
};
//# sourceMappingURL=accordionPanelHelper.js.map