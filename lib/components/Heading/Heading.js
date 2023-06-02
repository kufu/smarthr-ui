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
exports.Heading = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Text_1 = require("../Text");
const useClassNames_1 = require("./useClassNames");
const Heading = ({ tag = 'h1', type = 'screenTitle', className = '', ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)();
    const textProps = (0, react_1.useMemo)(() => {
        switch (type) {
            case 'screenTitle':
                return {
                    size: 'XL',
                    weight: 'normal',
                };
            case 'sectionTitle':
                return {
                    size: 'L',
                    weight: 'normal',
                };
            case 'blockTitle':
                return {
                    size: 'M',
                    weight: 'bold',
                };
            case 'subBlockTitle':
                return {
                    size: 'M',
                    weight: 'bold',
                    color: 'TEXT_GREY',
                };
            case 'subSubBlockTitle':
                return {
                    size: 'S',
                    weight: 'bold',
                    color: 'TEXT_GREY',
                };
        }
    }, [type]);
    return (react_1.default.createElement(ResetText, { ...props, ...textProps, forwardedAs: tag, leading: "TIGHT", className: `${type} ${className} ${classNames.wrapper}` }));
};
exports.Heading = Heading;
const ResetText = (0, styled_components_1.default)(Text_1.Text) `
  margin: unset;
`;
//# sourceMappingURL=Heading.js.map