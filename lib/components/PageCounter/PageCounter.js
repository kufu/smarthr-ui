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
exports.PageCounter = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Layout_1 = require("../Layout");
const Text_1 = require("../Text");
const PageCounter = ({ start, end, total = 0 }) => {
    const theme = (0, useTheme_1.useTheme)();
    return (react_1.default.createElement(Wrapper, { themes: theme },
        total > 0 && (react_1.default.createElement(Wrapper, { as: "span", gap: 0.25, themes: theme },
            react_1.default.createElement(Bold, null, total.toLocaleString()),
            "\u4EF6\u4E2D")),
        react_1.default.createElement(Wrapper, { as: "span", gap: 0.25, themes: theme },
            react_1.default.createElement(Bold, null, start.toLocaleString()),
            "\u2013",
            react_1.default.createElement(Bold, null, end.toLocaleString()),
            "\u4EF6")));
};
exports.PageCounter = PageCounter;
const Wrapper = (0, styled_components_1.default)(Layout_1.Cluster).attrs({ align: 'baseline', inline: true }) `
  ${({ themes: { fontSize } }) => (0, styled_components_1.css) `
    font-size: ${fontSize.M};
  `}
`;
const Bold = (0, styled_components_1.default)(Text_1.Text).attrs({ weight: 'bold', forwardedAs: 'b' }) ``;
//# sourceMappingURL=PageCounter.js.map