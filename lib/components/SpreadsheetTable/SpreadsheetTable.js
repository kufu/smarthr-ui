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
exports.SpreadsheetTable = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const SpreadsheetTableCorner_1 = require("./SpreadsheetTableCorner");
const SpreadsheetTable = ({ data, children }) => {
    const theme = (0, useTheme_1.useTheme)();
    return (react_1.default.createElement(Wrapper, { themes: theme },
        data && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("thead", null,
                react_1.default.createElement("tr", null,
                    react_1.default.createElement(SpreadsheetTableCorner_1.SpreadsheetTableCorner, null),
                    data[0].map((_, i) => (react_1.default.createElement("th", { key: `headRow-${i}` }, String.fromCharCode(65 + i)))))),
            react_1.default.createElement("tbody", null, data.map((row, i) => (react_1.default.createElement("tr", { key: `bodyRow-${i}` },
                react_1.default.createElement("th", null, i + 1),
                row.map((cell, j) => (react_1.default.createElement("td", { key: `bodyCell-${i}-${j}` }, cell))))))))),
        children));
};
exports.SpreadsheetTable = SpreadsheetTable;
const Wrapper = styled_components_1.default.table `
  ${({ themes: { border, color, fontSize, leading, space } }) => (0, styled_components_1.css) `
    border-collapse: collapse;
    border: ${border.shorthand};
    background-color: ${color.HEAD};

    th,
    td {
      padding: ${space(0.25)};
      font-size: ${fontSize.S};
    }

    th {
      font-weight: normal;
      color: ${color.TEXT_GREY};
    }

    th + th {
      border-inline-start: 1px solid ${color.hoverColor(color.HEAD)};
    }

    tr + tr th {
      border-block-start: 1px solid ${color.hoverColor(color.HEAD)};
      width: calc(1em * ${leading.NORMAL});
    }

    td {
      border: ${border.shorthand};
      background-color: ${color.WHITE};
    }
  `}
`;
//# sourceMappingURL=SpreadsheetTable.js.map