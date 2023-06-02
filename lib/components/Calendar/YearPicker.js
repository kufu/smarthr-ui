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
exports.YearPicker = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const useClassNames_1 = require("./useClassNames");
const YearPicker = ({ selectedYear, fromYear, toYear, onSelectYear, isDisplayed, id, ...props }) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const focusingRef = (0, react_1.useRef)(null);
    const thisYear = new Date().getFullYear();
    const numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0);
    const yearArray = Array(numOfYear)
        .fill(null)
        .map((_, i) => fromYear + i);
    (0, react_1.useEffect)(() => {
        if (focusingRef.current && isDisplayed) {
            focusingRef.current.focus();
            focusingRef.current.blur();
        }
    }, [isDisplayed]);
    return (react_1.default.createElement(Overlay, { ...props, themes: themes, isDisplayed: isDisplayed, id: id, className: `${props.className} ${classNames.yearPicker.wrapper}` },
        react_1.default.createElement(Container, { themes: themes }, yearArray.map((year) => {
            const isThisYear = thisYear === year;
            const isSelectedYear = selectedYear === year;
            return (react_1.default.createElement(YearButton, { key: year, themes: themes, onClick: () => onSelectYear(year), "aria-pressed": isSelectedYear, ref: isThisYear ? focusingRef : null, className: classNames.yearPicker.selectYear },
                react_1.default.createElement(YearWrapper, { themes: themes, isThisYear: isThisYear, isSelected: isSelectedYear }, year)));
        }))));
};
exports.YearPicker = YearPicker;
const Overlay = styled_components_1.default.div `
  ${({ isDisplayed }) => !isDisplayed &&
    (0, styled_components_1.css) `
      display: none;
    `}
  position: absolute;
  inset: 0;
  background-color: ${({ themes }) => themes.color.WHITE};
`;
const Container = styled_components_1.default.div `
  ${({ themes: { spacingByChar } }) => (0, styled_components_1.css) `
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    padding: ${spacingByChar(0.5)} ${spacingByChar(0.25)};
    box-sizing: border-box;
    overflow-y: auto;
  `}
`;
const YearWrapper = styled_components_1.default.span(({ themes, isThisYear, isSelected }) => {
    const { border, color, fontSize, leading, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      display: inline-block;
      padding: ${spacingByChar(0.5)} ${spacingByChar(0.75)};
      border-radius: 2rem;
      font-size: ${fontSize.M};
      box-sizing: border-box;
      line-height: ${leading.NONE};
      ${isThisYear &&
        (0, styled_components_1.css) `
        border: ${border.shorthand};
      `};
      ${isSelected &&
        (0, styled_components_1.css) `
        color: ${color.TEXT_WHITE} !important;
        background-color: ${color.MAIN} !important;
      `}
    `;
});
const YearButton = (0, styled_components_1.default)(Button_1.UnstyledButton) `
  ${({ themes: { color, leading, spacingByChar } }) => (0, styled_components_1.css) `
    width: 25%;
    padding: ${spacingByChar(0.5)} 0;
    line-height: ${leading.NONE};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      ${YearWrapper} {
        color: ${color.TEXT_BLACK};
        background-color: ${color.BASE_GREY};
      }
    }
  `}
`;
//# sourceMappingURL=YearPicker.js.map