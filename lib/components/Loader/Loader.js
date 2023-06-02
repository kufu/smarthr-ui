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
exports.Loader = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const VisuallyHiddenText_1 = require("../VisuallyHiddenText");
const loaderAnimation_1 = require("./loaderAnimation");
const useClassNames_1 = require("./useClassNames");
const Loader = ({ size = 'm', alt = '処理中', text, type = 'primary', className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, role: "status" },
        react_1.default.createElement(Spinner, { className: size },
            [...Array(4)].map((_, index) => (react_1.default.createElement(Line, { className: `line${index + 1} ${type}`, key: index, themes: theme },
                react_1.default.createElement(Cog, null,
                    react_1.default.createElement(CogInner, { className: "cogInner left" })),
                react_1.default.createElement(Ticker, null,
                    react_1.default.createElement(CogInner, { className: "cogInner center" })),
                react_1.default.createElement(Cog, null,
                    react_1.default.createElement(CogInner, { className: "cogInner right" }))))),
            react_1.default.createElement(VisuallyHiddenText_1.VisuallyHiddenText, null, alt)),
        text && (react_1.default.createElement(Text, { className: type, themes: theme }, text))));
};
exports.Loader = Loader;
const Wrapper = styled_components_1.default.div `
  display: inline-block;
  overflow: hidden;
`;
const Spinner = styled_components_1.default.div `
  position: relative;
  animation: ${loaderAnimation_1.containerRotate} 1600ms linear infinite;
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
const Line = styled_components_1.default.div `
  ${({ themes }) => {
    const { color } = themes;
    return (0, styled_components_1.css) `
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;

      &.line1 {
        /* stylelint-disable */
        animation: ${loaderAnimation_1.fillUnfillRotate} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both,
          ${loaderAnimation_1.line1FadeInOut} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both;
      }
      &.line2 {
        animation: ${loaderAnimation_1.fillUnfillRotate} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both,
          ${loaderAnimation_1.line2FadeInOut} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both;
      }
      &.line3 {
        animation: ${loaderAnimation_1.fillUnfillRotate} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both,
          ${loaderAnimation_1.line3FadeInOut} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both;
      }
      &.line4 {
        animation: ${loaderAnimation_1.fillUnfillRotate} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both,
          ${loaderAnimation_1.line4FadeInOut} ${loaderAnimation_1.lineDuration} ${loaderAnimation_1.spinnerEasing} infinite both;
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
const Cog = styled_components_1.default.div `
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
`;
const CogInner = styled_components_1.default.div `
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
    animation: ${loaderAnimation_1.leftSpin} ${loaderAnimation_1.cogDuration} ${loaderAnimation_1.spinnerEasing} infinite both;
  }
  &.center {
    width: 1000%;
    left: -450%;
  }
  &.right {
    left: -100%;
    border-left-color: transparent;
    transform: rotate(-129deg);
    animation: ${loaderAnimation_1.rightSpin} ${loaderAnimation_1.cogDuration} ${loaderAnimation_1.spinnerEasing} infinite both;
  }
`;
const Ticker = styled_components_1.default.div `
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 45%;
  width: 10%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
`;
const Text = styled_components_1.default.p `
  ${({ themes }) => {
    const { fontSize, color, spacingByChar } = themes;
    return (0, styled_components_1.css) `
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