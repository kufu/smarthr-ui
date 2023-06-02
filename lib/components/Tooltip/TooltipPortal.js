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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipPortal = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Balloon_1 = require("../Balloon");
const tooltipHelper_1 = require("./tooltipHelper");
const useClassNames_1 = require("./useClassNames");
const TooltipPortal = ({ message, id, isVisible, parentRect, isIcon = false, isMultiLine = false, horizontal, vertical, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const portalRef = (0, react_1.useRef)(null);
    const [rect, setRect] = (0, react_1.useState)({
        top: 0,
        left: 0,
        $width: 0,
        $height: 0,
    });
    const [actualHorizontal, setActualHorizontal] = (0, react_1.useState)(horizontal === 'auto' ? null : horizontal);
    const [actualVertical, setActualVertical] = (0, react_1.useState)(vertical === 'auto' ? null : vertical);
    const outerMargin = 10;
    (0, react_1.useEffect)(() => {
        if (!portalRef.current || !parentRect) {
            return;
        }
        const { offsetWidth, offsetHeight } = portalRef.current;
        if (vertical === 'auto') {
            const requiredHeight = offsetHeight + outerMargin;
            const topSpace = parentRect.top;
            const bottomSpace = window.innerHeight - parentRect.bottom;
            setActualVertical(() => {
                if (topSpace > requiredHeight) {
                    return 'bottom';
                }
                else if (bottomSpace > requiredHeight || bottomSpace > topSpace) {
                    return 'top';
                }
                else {
                    return 'bottom';
                }
            });
        }
        if (horizontal === 'auto') {
            const requiredWidth = offsetWidth + outerMargin;
            const leftSpace = vertical === 'middle' ? parentRect.left : parentRect.right;
            const rightSpace = vertical === 'middle'
                ? window.innerWidth - parentRect.right
                : window.innerWidth - parentRect.left;
            setActualHorizontal(() => {
                if (rightSpace > requiredWidth) {
                    return 'left';
                }
                else if (leftSpace > requiredWidth || leftSpace > rightSpace) {
                    return 'right';
                }
                else {
                    return 'left';
                }
            });
        }
    }, [horizontal, parentRect, vertical]);
    (0, react_1.useEffect)(() => {
        if (!isVisible || !portalRef.current || !actualHorizontal || !actualVertical || !parentRect) {
            return;
        }
        const { offsetWidth, offsetHeight } = portalRef.current;
        setRect((0, tooltipHelper_1.getTooltipRect)({
            parentRect,
            tooltipSize: {
                width: offsetWidth,
                height: offsetHeight,
            },
            vertical: actualVertical,
            horizontal: actualHorizontal,
            isIcon,
            outerMargin,
        }));
    }, [actualHorizontal, actualVertical, isIcon, isVisible, parentRect]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Container, { ...rect, id: id, ref: portalRef, themes: theme, role: "tooltip", className: classNames.popup, "aria-hidden": !isVisible, maxWidth: isMultiLine ? parentRect?.width : undefined },
        react_1.default.createElement(StyledBalloon, { horizontal: actualHorizontal || 'left', vertical: actualVertical || 'bottom', isMultiLine: isMultiLine },
            react_1.default.createElement(StyledBalloonText, { themes: theme }, message))));
};
exports.TooltipPortal = TooltipPortal;
const Container = styled_components_1.default.div `
  ${({ top, left, $width, $height, maxWidth, themes }) => {
    return (0, styled_components_1.css) `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      ${$width > 0 &&
        (0, styled_components_1.css) `
        width: ${$width}px;
      `}
      ${$height > 0 &&
        (0, styled_components_1.css) `
        height: ${$height}px;
      `}
      ${maxWidth !== undefined &&
        (0, styled_components_1.css) `
        max-width: ${maxWidth}px;
      `}
      z-index: ${themes.zIndex.OVERLAP};
      &[aria-hidden='true'] {
        display: none;
      }
    `;
}}
`;
const StyledBalloon = (0, styled_components_1.default)(Balloon_1.Balloon)(({ isMultiLine }) => isMultiLine &&
    (0, styled_components_1.css) `
      max-width: 100%;
      white-space: normal;
    `);
const StyledBalloonText = styled_components_1.default.p `
  margin: 0;
  ${({ themes: { spacingByChar } }) => {
    return (0, styled_components_1.css) `
      padding: ${spacingByChar(0.5)} ${spacingByChar(1)};
    `;
}}
`;
//# sourceMappingURL=TooltipPortal.js.map