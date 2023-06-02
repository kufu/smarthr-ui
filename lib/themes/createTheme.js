"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTheme = void 0;
const createBorder_1 = require("./createBorder");
const createBreakpoint_1 = require("./createBreakpoint");
const createColor_1 = require("./createColor");
const createFontSize_1 = require("./createFontSize");
const createFrame_1 = require("./createFrame");
const createInteraction_1 = require("./createInteraction");
const createLeading_1 = require("./createLeading");
const createPalette_1 = require("./createPalette");
const createRadius_1 = require("./createRadius");
const createShadow_1 = require("./createShadow");
const createSize_1 = require("./createSize");
const createSpacing_1 = require("./createSpacing");
const createZIndex_1 = require("./createZIndex");
const createTheme = (theme = {}) => {
    const paletteProperty = getPaletteProperty(theme);
    const colorProperty = getColorProperty(theme);
    const baseSize = getSpacingProperty(theme).baseSize;
    const spacingByChar = (0, createSpacing_1.createSpacingByChar)(baseSize);
    return {
        palette: (0, createPalette_1.createPalette)(paletteProperty),
        color: (0, createColor_1.createColor)(colorProperty),
        size: (0, createSize_1.createSize)(getSizeProperty(theme)),
        fontSize: (0, createFontSize_1.createFontSize)(getFontSizeProperty(theme)),
        spacing: (0, createSpacing_1.createSpacing)(baseSize),
        spacingByChar,
        space: spacingByChar,
        leading: (0, createLeading_1.createLeading)(getLeadingProperty(theme)),
        breakpoint: (0, createBreakpoint_1.createBreakpoint)(getBreakpointProperty(theme)),
        frame: (0, createFrame_1.createFrame)(getFrameProperty(theme), paletteProperty),
        border: (0, createBorder_1.createBorder)(getBorderProperty(theme), colorProperty),
        radius: (0, createRadius_1.createRadius)(getRadiusProperty(theme)),
        interaction: (0, createInteraction_1.createInteraction)(theme.interaction),
        shadow: (0, createShadow_1.createShadow)(theme.shadow, colorProperty),
        zIndex: (0, createZIndex_1.createZIndex)(theme.zIndex),
    };
};
exports.createTheme = createTheme;
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