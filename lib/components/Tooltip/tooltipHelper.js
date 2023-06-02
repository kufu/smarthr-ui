"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTooltipRect = void 0;
function getTooltipRect({ parentRect, tooltipSize, vertical, horizontal, isIcon = false, outerMargin, }) {
    const top = getTop({
        parentRect,
        tooltipHeight: tooltipSize.height,
        vertical,
        outerMargin,
    });
    const left = getLeft({
        parentRect,
        tooltipWidth: tooltipSize.width,
        horizontal,
        vertical,
        isIcon,
        outerMargin,
    });
    return {
        top: top + window.pageYOffset,
        left: left + window.pageXOffset,
        $width: tooltipSize.width,
        $height: tooltipSize.height,
    };
}
exports.getTooltipRect = getTooltipRect;
function getTop({ parentRect, tooltipHeight, vertical, outerMargin, }) {
    switch (vertical) {
        case 'top':
            return parentRect.top + parentRect.height + outerMargin;
        case 'middle':
            return parentRect.top + (parentRect.height - tooltipHeight) / 2;
        case 'bottom':
            return parentRect.top - tooltipHeight - outerMargin;
    }
}
function getLeft({ parentRect, tooltipWidth, horizontal, vertical, isIcon, outerMargin, }) {
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
            const arrowPosition = 29; // length between Balloon edge and center of arrow
            const iconGap = isIcon ? arrowPosition - parentRect.width / 2 : 0; // to align center of Balloon arrow and icon
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