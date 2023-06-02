import React, { useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { UnstyledButton } from '../Button';
import { useClassNames } from './useClassNames';
export const YearPicker = ({ selectedYear, fromYear, toYear, onSelectYear, isDisplayed, id, ...props }) => {
    const themes = useTheme();
    const classNames = useClassNames();
    const focusingRef = useRef(null);
    const thisYear = new Date().getFullYear();
    const numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0);
    const yearArray = Array(numOfYear)
        .fill(null)
        .map((_, i) => fromYear + i);
    useEffect(() => {
        if (focusingRef.current && isDisplayed) {
            focusingRef.current.focus();
            focusingRef.current.blur();
        }
    }, [isDisplayed]);
    return (React.createElement(Overlay, { ...props, themes: themes, isDisplayed: isDisplayed, id: id, className: `${props.className} ${classNames.yearPicker.wrapper}` },
        React.createElement(Container, { themes: themes }, yearArray.map((year) => {
            const isThisYear = thisYear === year;
            const isSelectedYear = selectedYear === year;
            return (React.createElement(YearButton, { key: year, themes: themes, onClick: () => onSelectYear(year), "aria-pressed": isSelectedYear, ref: isThisYear ? focusingRef : null, className: classNames.yearPicker.selectYear },
                React.createElement(YearWrapper, { themes: themes, isThisYear: isThisYear, isSelected: isSelectedYear }, year)));
        }))));
};
const Overlay = styled.div `
  ${({ isDisplayed }) => !isDisplayed &&
    css `
      display: none;
    `}
  position: absolute;
  inset: 0;
  background-color: ${({ themes }) => themes.color.WHITE};
`;
const Container = styled.div `
  ${({ themes: { spacingByChar } }) => css `
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
const YearWrapper = styled.span(({ themes, isThisYear, isSelected }) => {
    const { border, color, fontSize, leading, spacingByChar } = themes;
    return css `
      display: inline-block;
      padding: ${spacingByChar(0.5)} ${spacingByChar(0.75)};
      border-radius: 2rem;
      font-size: ${fontSize.M};
      box-sizing: border-box;
      line-height: ${leading.NONE};
      ${isThisYear &&
        css `
        border: ${border.shorthand};
      `};
      ${isSelected &&
        css `
        color: ${color.TEXT_WHITE} !important;
        background-color: ${color.MAIN} !important;
      `}
    `;
});
const YearButton = styled(UnstyledButton) `
  ${({ themes: { color, leading, spacingByChar } }) => css `
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