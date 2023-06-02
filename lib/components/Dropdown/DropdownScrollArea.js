"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownScrollArea = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useClassNames_1 = require("./useClassNames");
const DropdownScrollArea = ({ children, className = '', ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.scrollArea}` }, children));
};
exports.DropdownScrollArea = DropdownScrollArea;
const Wrapper = styled_components_1.default.div `
  overflow-y: auto;
  flex: 1 1 auto;
`;
//# sourceMappingURL=DropdownScrollArea.js.map