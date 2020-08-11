"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearPicker = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var ResetButton_1 = require("./ResetButton");
exports.YearPicker = function (_a) {
    var selectedYear = _a.selectedYear, fromYear = _a.fromYear, toYear = _a.toYear, onSelectYear = _a.onSelectYear;
    var themes = useTheme_1.useTheme();
    var scrollingRef = react_1.useRef(null);
    var thisYear = new Date().getFullYear();
    var numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0);
    var yearArray = Array(numOfYear)
        .fill(null)
        .map(function (_, i) { return fromYear + i; });
    react_1.useEffect(function () {
        if (scrollingRef.current) {
            scrollingRef.current.scrollIntoView({ block: 'center' });
        }
    }, []);
    return (react_1.default.createElement(Container, null, yearArray.map(function (year) {
        var isThisYear = thisYear === year;
        var isSelectedYear = selectedYear === year;
        return (react_1.default.createElement(YearButton, { key: year, themes: themes, onClick: function () { return onSelectYear(year); }, "aria-pressed": isSelectedYear },
            react_1.default.createElement(YearWrapper, { themes: themes, isThisYear: isThisYear, isSelected: isSelectedYear, ref: isThisYear ? scrollingRef : null }, year)));
    })));
};
var Container = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  height: 100%;\n  padding: 8px 3px;\n  box-sizing: border-box;\n  overflow-y: scroll;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  height: 100%;\n  padding: 8px 3px;\n  box-sizing: border-box;\n  overflow-y: scroll;\n"])));
var YearWrapper = styled_components_1.default.div(function (_a) {
    var themes = _a.themes, isThisYear = _a.isThisYear, isSelected = _a.isSelected;
    var palette = themes.palette, size = themes.size;
    return styled_components_1.css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 51px;\n      height: 27px;\n      border-radius: 14px;\n      font-size: ", ";\n      box-sizing: border-box;\n      line-height: 0;\n      ", ";\n      ", "\n    "], ["\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 51px;\n      height: 27px;\n      border-radius: 14px;\n      font-size: ", ";\n      box-sizing: border-box;\n      line-height: 0;\n      ",
        ";\n      ",
        "\n    "])), size.pxToRem(size.font.TALL), isThisYear && styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        border: solid 1px ", ";\n      "], ["\n        border: solid 1px ", ";\n      "])), palette.BORDER), isSelected && styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        color: #fff !important;\n        background-color: ", " !important;\n      "], ["\n        color: #fff !important;\n        background-color: ", " !important;\n      "])), palette.MAIN));
});
var YearButton = styled_components_1.default(ResetButton_1.ResetButton)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 25%;\n  height: 43px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  &:hover {\n    ", " {\n      color: ", ";\n      background-color: #f5f5f5;\n    }\n  }\n"], ["\n  width: 25%;\n  height: 43px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  &:hover {\n    ", " {\n      color: ", ";\n      background-color: #f5f5f5;\n    }\n  }\n"])), YearWrapper, function (props) { return props.themes.palette.TEXT_BLACK; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=YearPicker.js.map