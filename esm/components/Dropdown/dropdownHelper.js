export function hasParentElement(element, parent) {
    if (!element)
        return false;
    return element === parent || hasParentElement(element.parentElement, parent);
}
export function getContentBoxStyle(triggerRect, contentSize, windowSize, scroll) {
    var contentBox = {
        top: 'auto',
        left: 'auto',
        maxHeight: '',
    };
    if (triggerRect.bottom + contentSize.height <= windowSize.height) {
        contentBox.top = scroll.top + triggerRect.bottom - 5 + "px";
    }
    else if (triggerRect.top - contentSize.height >= 0) {
        contentBox.top = scroll.top + triggerRect.top - contentSize.height + 5 + "px";
    }
    else {
        var padding = 10;
        if (triggerRect.top + (triggerRect.bottom - triggerRect.top) / 2 < windowSize.height / 2) {
            contentBox.top = scroll.top + triggerRect.bottom - 5 + "px";
            contentBox.maxHeight = windowSize.height - triggerRect.bottom - padding + "px";
        }
        else {
            contentBox.top = scroll.top + padding + 5 + "px";
            contentBox.maxHeight = triggerRect.top - padding + "px";
        }
    }
    var triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2;
    if (triggerAlignCenter <= windowSize.width / 2) {
        contentBox.left = scroll.left + triggerRect.left - 5 + "px";
    }
    else {
        contentBox.left = scroll.left + triggerRect.right - contentSize.width + 5 + "px";
    }
    return contentBox;
}
//# sourceMappingURL=dropdownHelper.js.map