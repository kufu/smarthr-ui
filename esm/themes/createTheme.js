import { createBorder } from './createBorder';
import { createBreakpoint } from './createBreakpoint';
import { createColor } from './createColor';
import { createFontSize } from './createFontSize';
import { createFrame } from './createFrame';
import { createInteraction, } from './createInteraction';
import { createLeading } from './createLeading';
import { createPalette } from './createPalette';
import { createRadius } from './createRadius';
import { createShadow } from './createShadow';
import { createSize } from './createSize';
import { createSpacing, createSpacingByChar, } from './createSpacing';
import { createZIndex } from './createZIndex';
export const createTheme = (theme = {}) => {
    const paletteProperty = getPaletteProperty(theme);
    const colorProperty = getColorProperty(theme);
    const baseSize = getSpacingProperty(theme).baseSize;
    const spacingByChar = createSpacingByChar(baseSize);
    return {
        palette: createPalette(paletteProperty),
        color: createColor(colorProperty),
        size: createSize(getSizeProperty(theme)),
        fontSize: createFontSize(getFontSizeProperty(theme)),
        spacing: createSpacing(baseSize),
        spacingByChar,
        space: spacingByChar,
        leading: createLeading(getLeadingProperty(theme)),
        breakpoint: createBreakpoint(getBreakpointProperty(theme)),
        frame: createFrame(getFrameProperty(theme), paletteProperty),
        border: createBorder(getBorderProperty(theme), colorProperty),
        radius: createRadius(getRadiusProperty(theme)),
        interaction: createInteraction(theme.interaction),
        shadow: createShadow(theme.shadow, colorProperty),
        zIndex: createZIndex(theme.zIndex),
    };
};
function getPaletteProperty(theme) {
    return {
        ...theme.palette,
        ...theme.color,
    };
}
function getColorProperty(theme) {
    return {
        ...theme.palette,
        ...theme.color,
    };
}
function getSizeProperty(theme) {
    return {
        htmlFontSize: theme.fontSize?.htmlFontSize || theme.size?.htmlFontSize,
        space: {
            defaultRem: theme.size?.space?.defaultRem,
            XXS: theme.size?.space?.XXS,
            XS: theme.size?.space?.XS,
            S: theme.size?.space?.S,
            M: theme.size?.space?.M,
            L: theme.size?.space?.L,
            XL: theme.size?.space?.XL,
            XXL: theme.size?.space?.XXL,
        },
        font: {
            SHORT: theme.fontSize?.SHORT || theme.size?.font?.SHORT,
            TALL: theme.fontSize?.TALL || theme.size?.font?.TALL,
            GRANDE: theme.fontSize?.GRANDE || theme.size?.font?.GRANDE,
            VENTI: theme.fontSize?.VENTI || theme.size?.font?.VENTI,
        },
        mediaQuery: {
            ...theme.size?.mediaQuery,
            ...theme.breakpoint,
        },
    };
}
function getFontSizeProperty(theme) {
    return {
        htmlFontSize: theme.size?.htmlFontSize,
        ...theme.size?.font,
        ...theme.fontSize,
    };
}
const getLeadingProperty = (theme) => {
    return { ...theme.leading };
};
function getSpacingProperty(theme) {
    return {
        baseSize: theme.spacing?.baseSize,
    };
}
function getBreakpointProperty(theme) {
    return {
        ...theme.size?.mediaQuery,
        ...theme.breakpoint,
    };
}
function getFrameProperty(theme) {
    return {
        border: {
            lineWidth: theme.border?.lineWidth || theme.frame?.border?.lineWidth,
            lineStyle: theme.border?.lineStyle || theme.frame?.border?.lineStyle,
            default: theme.border?.shorthand || theme.frame?.border?.default,
            radius: {
                ...theme.frame?.border?.radius,
                ...theme.radius,
            },
        },
    };
}
function getBorderProperty(theme) {
    return {
        lineWidth: theme.border?.lineWidth || theme.frame?.border?.lineWidth,
        lineStyle: theme.border?.lineStyle || theme.frame?.border?.lineStyle,
        shorthand: theme.border?.shorthand || theme.frame?.border?.default,
    };
}
function getRadiusProperty(theme) {
    return {
        ...theme.frame?.border?.radius,
        ...theme.radius,
    };
}
//# sourceMappingURL=createTheme.js.map