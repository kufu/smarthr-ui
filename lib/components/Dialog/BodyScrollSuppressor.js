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
exports.BodyScrollSuppressor = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = require("styled-components");
const BodyScrollSuppressor = () => {
    const [scrollBarWidth, setScrollBarWidth] = (0, react_1.useState)(null);
    const [paddingRight, setPaddingRight] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        setScrollBarWidth(window.innerWidth - document.body.clientWidth);
    }, []);
    (0, react_1.useEffect)(() => {
        if (scrollBarWidth === null) {
            return;
        }
        const originalPaddingRight = getComputedStyle(document.body).getPropertyValue('padding-right');
        setPaddingRight(scrollBarWidth + parseInt(originalPaddingRight, 10));
    }, [scrollBarWidth]);
    if (scrollBarWidth === null) {
        return null;
    }
    return react_1.default.createElement(ScrollSuppressing, { paddingRight: paddingRight });
};
exports.BodyScrollSuppressor = BodyScrollSuppressor;
const ScrollSuppressing = (0, styled_components_1.createGlobalStyle) `
  body {
    overflow: hidden;
    ${({ paddingRight }) => paddingRight &&
    (0, styled_components_1.css) `
        padding-right: ${paddingRight}px !important;
      `}
  }
`;
//# sourceMappingURL=BodyScrollSuppressor.js.map