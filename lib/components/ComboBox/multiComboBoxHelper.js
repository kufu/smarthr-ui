"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasParentElementByClassName = void 0;
function hasParentElementByClassName(element, className) {
    if (!element)
        return false;
    return (element.classList.contains(className) ||
        hasParentElementByClassName(element.parentElement, className));
}
exports.hasParentElementByClassName = hasParentElementByClassName;
//# sourceMappingURL=multiComboBoxHelper.js.map