import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { VisuallyHiddenText } from '../VisuallyHiddenText';
import { cogDuration, containerRotate, fillUnfillRotate, leftSpin, line1FadeInOut, line2FadeInOut, line3FadeInOut, line4FadeInOut, lineDuration, rightSpin, spinnerEasing, } from './loaderAnimation';
import { useClassNames } from './useClassNames';
export const Loader = ({ size = 'm', alt = '処理中', text, type = 'primary', className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, role: "status" },
        React.createElement(Spinner, { className: size },
            [...Array(4)].map((_, index) => (React.createElement(Line, { className: `line${index + 1} ${type}`, key: index, themes: theme },
                React.createElement(Cog, null,
                    React.createElement(CogInner, { className: "cogInner left" })),
                React.createElement(Ticker, null,
                    React.createElement(CogInner, { className: "cogInner center" })),
                React.createElement(Cog, null,
                    React.createElement(CogInner, { className: "cogInner right" }))))),
            React.createElement(VisuallyHiddenText, null, alt)),
        text && (React.createElement(Text, { className: type, themes: theme }, text))));
};
const Wrapper = styled.div `
  display: inline-block;
  overflow: hidden;
`;
const Spinner = styled.div `
  position: relative;
  animation: ${containerRotate} 1600ms linear infinite;
  margin: 0 auto;

  &.m {
    width: 48px;
    height: 48px;

    .cogInner {
      border-width: 4px;
    }
  }
  &.s {
    width: 24px;
    height: 24px;

    .cogInner {
      border-width: 2px;
    }
  }
`;
const Line = styled.div `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;

      &.line1 {
        /* stylelint-disable */
        animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
          ${line1FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
      }
      &.line2 {
        animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
          ${line2FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
      }
      &.line3 {
        animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
          ${line3FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
      }
      &.line4 {
        animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
          ${line4FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
      }
      /* stylelint-enable */

      &.primary {
        border-color: ${color.BRAND};

        @media (prefers-contrast: more) {
          & {
            border-color: ${color.MAIN};
          }
        }
      }
      &.light {
        border-color: ${color.WHITE};
      }
    `;
}}
`;
const Cog = styled.div `
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
`;
const CogInner = styled.div `
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  box-sizing: border-box;
  height: 100%;
  border-style: solid;
  border-color: inherit;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: none;

  &.left {
    border-right-color: transparent;
    transform: rotate(129deg);
    animation: ${leftSpin} ${cogDuration} ${spinnerEasing} infinite both;
  }
  &.center {
    width: 1000%;
    left: -450%;
  }
  &.right {
    left: -100%;
    border-left-color: transparent;
    transform: rotate(-129deg);
    animation: ${rightSpin} ${cogDuration} ${spinnerEasing} infinite both;
  }
`;
const Ticker = styled.div `
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 45%;
  width: 10%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
`;
const Text = styled.p `
  ${({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return css `
      margin-top: ${spacingByChar(1)};
      font-size: ${fontSize.M};
      text-align: center;

      &.primary {
        color: ${color.TEXT_BLACK};
      }
      &.light {
        color: ${color.TEXT_WHITE};
      }
    `;
}}
`;
//# sourceMappingURL=Loader.js.map