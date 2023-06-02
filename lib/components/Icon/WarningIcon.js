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
exports.WarningIcon = void 0;
const react_1 = __importDefault(require("react"));
const react_icons_1 = require("react-icons");
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const generateIcon_1 = require("./generateIcon");
const Wrapper = (0, styled_components_1.default)(react_icons_1.IconBase)(() => {
    const { color } = (0, useTheme_1.useTheme)();
    return (0, styled_components_1.css) `
    .base {
      fill: ${color.WARNING_YELLOW};
      stroke: ${color.TEXT_BLACK};
      stroke-width: 1;
    }
    .mark {
      fill: ${color.TEXT_BLACK};
    }
  `;
});
exports.WarningIcon = (0, generateIcon_1.generateIcon)((props) => (react_1.default.createElement(Wrapper, { ...props, viewBox: "0 0 14 13" },
    react_1.default.createElement("path", { d: "M13.536 10.308v-.002L8.145.944C7.65.088 6.354.05 5.85.944l-.001.001-5.387 9.36c-.503.867.141 1.969 1.16 1.969h10.753a1.318 1.318 0 0 0 1.161-1.967Z", className: "base" }),
    react_1.default.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.82 7.827c-.019.128-.097.212-.199.238a.285.285 0 0 1-.07.009h-1.1a.286.286 0 0 1-.064-.007c-.105-.024-.187-.108-.206-.24l-.157-3.054c-.023-.157.112-.292.27-.292h1.413c.158 0 .292.135.27.292L7.82 7.827Zm-.306.785a1.03 1.03 0 0 0-1.535.899c0 .583.449 1.032 1.032 1.032a1.03 1.03 0 0 0 .503-1.931Z", className: "mark" }))));
//# sourceMappingURL=WarningIcon.js.map