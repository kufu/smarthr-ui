var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { ResetButton } from './ResetButton';
export var YearPicker = function (_a) {
    var selectedYear = _a.selectedYear, fromYear = _a.fromYear, toYear = _a.toYear, onSelectYear = _a.onSelectYear;
    var themes = useTheme();
    var focusingRef = useRef(null);
    var thisYear = new Date().getFullYear();
    var numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0);
    var yearArray = Array(numOfYear)
        .fill(null)
        .map(function (_, i) { return fromYear + i; });
    useEffect(function () {
        if (focusingRef.current) {
            focusingRef.current.focus();
            focusingRef.current.blur();
        }
    }, []);
    return (React.createElement(Container, null, yearArray.map(function (year) {
        var isThisYear = thisYear === year;
        var isSelectedYear = selectedYear === year;
        return (React.createElement(YearButton, { key: year, themes: themes, onClick: function () { return onSelectYear(year); }, "aria-pressed": isSelectedYear, ref: isThisYear ? focusingRef : null },
            React.createElement(YearWrapper, { themes: themes, isThisYear: isThisYear, isSelected: isSelectedYear }, year)));
    })));
};
var Container = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  height: 100%;\n  padding: 8px 3px;\n  box-sizing: border-box;\n  overflow-y: scroll;\n"], ["\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  height: 100%;\n  padding: 8px 3px;\n  box-sizing: border-box;\n  overflow-y: scroll;\n"])));
var YearWrapper = styled.div(function (_a) {
    var themes = _a.themes, isThisYear = _a.isThisYear, isSelected = _a.isSelected;
    var palette = themes.palette, size = themes.size;
    return css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 51px;\n      height: 27px;\n      border-radius: 14px;\n      font-size: ", ";\n      box-sizing: border-box;\n      line-height: 0;\n      ", ";\n      ", "\n    "], ["\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 51px;\n      height: 27px;\n      border-radius: 14px;\n      font-size: ", ";\n      box-sizing: border-box;\n      line-height: 0;\n      ",
        ";\n      ",
        "\n    "])), size.pxToRem(size.font.TALL), isThisYear && css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n        border: solid 1px ", ";\n      "], ["\n        border: solid 1px ", ";\n      "])), palette.BORDER), isSelected && css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        color: #fff !important;\n        background-color: ", " !important;\n      "], ["\n        color: #fff !important;\n        background-color: ", " !important;\n      "])), palette.MAIN));
});
var YearButton = styled(ResetButton)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 25%;\n  height: 43px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  &:hover {\n    ", " {\n      color: ", ";\n      background-color: #f5f5f5;\n    }\n  }\n"], ["\n  width: 25%;\n  height: 43px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  &:hover {\n    ", " {\n      color: ", ";\n      background-color: #f5f5f5;\n    }\n  }\n"])), YearWrapper, function (props) { return props.themes.palette.TEXT_BLACK; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=YearPicker.js.map