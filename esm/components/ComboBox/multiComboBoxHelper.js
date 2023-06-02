export function hasParentElementByClassName(element, className) {
    if (!element)
        return false;
    return (element.classList.contains(className) ||
        hasParentElementByClassName(element.parentElement, className));
}
//# sourceMappingURL=multiComboBoxHelper.js.map