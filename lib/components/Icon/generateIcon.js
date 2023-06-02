"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIcon = exports.generateIcon = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../hooks/useSpacing");
const useTheme_1 = require("../../hooks/useTheme");
const VisuallyHiddenText_1 = require("../VisuallyHiddenText");
const useClassNames_1 = require("./useClassNames");
const generateIcon = (svg) => (0, exports.createIcon)(svg);
exports.generateIcon = generateIcon;
const definedColors = [
    'TEXT_BLACK',
    'TEXT_WHITE',
    'TEXT_GREY',
    'TEXT_DISABLED',
    'TEXT_LINK',
    'MAIN',
    'DANGER',
    'WARNING',
    'BRAND',
];
const knownColorSet = new Set(definedColors);
const isDefinedColor = (color) => knownColorSet.has(color);
const createIcon = (SvgIcon) => {
    const Icon = ({ color, className = '', role = 'img', alt, 'aria-hidden': ariaHidden, focusable = false, text, iconGap = 0.25, right = false, ...props }) => {
        const hasLabelByAria = props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;
        const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !hasLabelByAria;
        const theme = (0, useTheme_1.useTheme)();
        const replacedColor = react_1.default.useMemo(() => {
            const asserted = color;
            if (asserted && isDefinedColor(asserted)) {
                return theme.color[asserted];
            }
            return color;
        }, [color, theme.color]);
        const classNames = (0, useClassNames_1.useClassNames)();
        const existsText = !!text;
        const svgIcon = (react_1.default.createElement(SvgIcon, { ...props, stroke: "currentColor", fill: "currentColor", strokeWidth: "0", width: "1em", height: "1em", color: replacedColor, className: `${className} ${classNames.wrapper}`, role: role, "aria-hidden": isAriaHidden || alt !== undefined || undefined, focusable: focusable }));
        if (existsText) {
            return (react_1.default.createElement(WithIcon, { gap: iconGap, right: right, className: classNames.withText },
                alt && react_1.default.createElement(VisuallyHiddenText_1.VisuallyHiddenText, null, alt),
                right && text,
                svgIcon,
                !right && text));
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            alt && react_1.default.createElement(VisuallyHiddenText_1.VisuallyHiddenText, null, alt),
            svgIcon));
    };
    Icon.displayName = SvgIcon.name;
    return Icon;
};
exports.createIcon = createIcon;
const WithIcon = styled_components_1.default.span `
  ${({ right, gap }) => (0, styled_components_1.css) `
    ${!right &&
    (0, styled_components_1.css) `
      display: inline-flex;
      align-items: baseline;
      ${gap && `column-gap: ${(0, useSpacing_1.useSpacing)(gap)};`}
    `}

    .smarthr-ui-Icon {
      flex-shrink: 0;
      transform: translateY(0.125em);
      ${right && gap && `margin-inline-start: ${(0, useSpacing_1.useSpacing)(gap)};`}
    }
  `}
`;
//# sourceMappingURL=generateIcon.js.map