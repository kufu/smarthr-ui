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
exports.TableReel = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useClassNames_1 = require("./useClassNames");
const useReelCells_1 = require("./useReelCells");
const useReelShadow_1 = require("./useReelShadow");
const TableReel = ({ children, className = '', ...props }) => {
    const { showShadow, tableWrapperRef } = (0, useReelCells_1.useReelCells)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { showShadow: showShadow, className: `${className} ${classNames.tableReel.wrapper}` },
        react_1.default.createElement(Inner, { ...props, ref: tableWrapperRef, className: classNames.tableReel.inner }, children)));
};
exports.TableReel = TableReel;
const Wrapper = styled_components_1.default.div `
  ${({ showShadow }) => (0, styled_components_1.css) `
    position: relative;

    ${(0, useReelShadow_1.useReelShadow)({ showShadow })}
  `}
`;
const Inner = styled_components_1.default.div `
  position: relative;
  overflow: auto;
`;
//# sourceMappingURL=TableReel.js.map