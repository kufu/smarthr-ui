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
exports.DefinitionList = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Layout_1 = require("../Layout");
const DefinitionListItem_1 = require("./DefinitionListItem");
const useClassNames_1 = require("./useClassNames");
const DefinitionList = ({ items, layout = 'single', className = '', }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { className: `${className} ${classNames.definitionList.wrapper}` }, items.map(({ term, description, className: itemClassName }, index) => (react_1.default.createElement(Item, { term: term, description: description, key: index, layout: layout, className: itemClassName, themes: theme })))));
};
exports.DefinitionList = DefinitionList;
const column = (layout) => {
    switch (layout) {
        case 'single':
            return 1;
        case 'double':
            return 2;
        case 'triple':
            return 3;
    }
};
const Wrapper = (0, styled_components_1.default)(Layout_1.Cluster).attrs({ as: 'dl', gap: 1.5 }) `
  margin-block: initial;
`;
const Item = (0, styled_components_1.default)(DefinitionListItem_1.DefinitionListItem) `
  ${({ layout, themes: { space } }) => {
    const $columns = column(layout);
    return (0, styled_components_1.css) `
      flex-basis: calc((100% - (${space(1.5)} * ${$columns - 1})) / ${$columns});
      flex-shrink: 1;
    `;
}}
`;
//# sourceMappingURL=DefinitionList.js.map