export declare function getTooltipRect({ parentRect, tooltipSize, vertical, horizontal, isMultiLine, isIcon, outerMargin, }: {
    parentRect: DOMRect;
    tooltipSize: {
        width: number;
        height: number;
    };
    vertical: 'top' | 'middle' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    isMultiLine: boolean;
    isIcon: boolean;
    outerMargin: number;
}): {
    top: number;
    left: number;
    width: number;
    height: number;
};
