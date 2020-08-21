export function getTooltipRect(_a) {
    var parentRect = _a.parentRect, tooltipSize = _a.tooltipSize, vertical = _a.vertical, horizontal = _a.horizontal, _b = _a.isMultiLine, isMultiLine = _b === void 0 ? false : _b, _c = _a.isIcon, isIcon = _c === void 0 ? false : _c, outerMargin = _a.outerMargin;
    var top = getTop({
        parentRect: parentRect,
        tooltipHeight: tooltipSize.height,
        vertical: vertical,
        outerMargin: outerMargin,
    });
    var left = getLeft({
        parentRect: parentRect,
        tooltipWidth: tooltipSize.width,
        horizontal: horizontal,
        vertical: vertical,
        isIcon: isIcon,
        outerMargin: outerMargin,
    });
    return {
        top: top + window.pageYOffset,
        left: left + window.pageXOffset,
        // If isMultiLine, width of the tooltip does not exceed width of the parent.
        width: isMultiLine ? Math.min(parentRect.width, tooltipSize.width) : tooltipSize.width,
        height: tooltipSize.height,
    };
}
function getTop(_a) {
    var parentRect = _a.parentRect, tooltipHeight = _a.tooltipHeight, vertical = _a.vertical, outerMargin = _a.outerMargin;
    switch (vertical) {
        case 'top':
            return parentRect.top + parentRect.height + outerMargin;
        case 'middle':
            return parentRect.top + (parentRect.height - tooltipHeight) / 2;
        case 'bottom':
            return parentRect.top - tooltipHeight - outerMargin;
    }
}
function getLeft(_a) {
    var parentRect = _a.parentRect, tooltipWidth = _a.tooltipWidth, horizontal = _a.horizontal, vertical = _a.vertical, isIcon = _a.isIcon, outerMargin = _a.outerMargin;
    switch (vertical) {
        case 'middle':
            switch (horizontal) {
                case 'right':
                    return parentRect.left - tooltipWidth - outerMargin;
                default:
                    return parentRect.left + parentRect.width + outerMargin;
            }
        case 'top':
        case 'bottom': {
            var arrowPosition = 29; // length between Balloon edge and center of arrow
            var iconGap = isIcon ? arrowPosition - parentRect.width / 2 : 0; // to align center of Balloon arrow and icon
            switch (horizontal) {
                case 'right':
                    return parentRect.left + parentRect.width - tooltipWidth + iconGap;
                case 'center':
                    return parentRect.left + (parentRect.width - tooltipWidth) / 2;
                case 'left':
                    return parentRect.left - iconGap;
            }
        }
    }
}
//# sourceMappingURL=tooltipHelper.js.map