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
exports.Portal = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useEnhancedEffect_1 = require("../../hooks/useEnhancedEffect");
const usePortal_1 = require("../../hooks/usePortal");
const useTheme_1 = require("../../hooks/useTheme");
const datePickerHelper_1 = require("./datePickerHelper");
const useClassNames_1 = require("./useClassNames");
exports.Portal = (0, react_1.forwardRef)(({ inputRect, children }, ref) => {
    const themes = (0, useTheme_1.useTheme)();
    const { createPortal } = (0, usePortal_1.usePortal)();
    const [position, setPosition] = (0, react_1.useState)({
        top: 0,
        left: 0,
    });
    const containerRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => containerRef.current);
    (0, useEnhancedEffect_1.useEnhancedEffect)(() => {
        if (!containerRef.current) {
            return;
        }
        setPosition((0, datePickerHelper_1.getPortalPosition)(inputRect, containerRef.current.offsetHeight));
    }, [inputRect]);
    const classNames = (0, useClassNames_1.useClassNames)();
    return createPortal(react_1.default.createElement(Container, { ...position, themes: themes, className: classNames.calendarContainer, ref: containerRef }, children));
});
const Container = styled_components_1.default.div(({ top, left, themes }) => (0, styled_components_1.css) `
    position: absolute;
    top: ${top}px;
    left: ${left}px;
    z-index: ${themes.zIndex.OVERLAP};
    line-height: 1;
  `);
//# sourceMappingURL=Portal.js.map