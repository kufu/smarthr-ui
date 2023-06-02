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
exports.ButtonWrapper = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
function ButtonWrapper({ size, square, className, ...props }) {
    const theme = (0, useTheme_1.useTheme)();
    const buttonClassName = (0, react_1.useMemo)(() => `${size} ${className} ${square ? 'square' : ''}`, [className, size, square]);
    return props.isAnchor ? (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    react_1.default.createElement(Anchor, { ...props, className: buttonClassName, ref: props.anchorRef, themes: theme })) : (react_1.default.createElement(Button, { ...props, className: buttonClassName, ref: props.buttonRef, themes: theme }));
}
exports.ButtonWrapper = ButtonWrapper;
const baseStyles = (0, styled_components_1.css)(({ wide, $loading, themes }) => {
    const { border, fontSize, leading, radius, shadow, spacingByChar } = themes;
    return (0, styled_components_1.css) `
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    ${$loading && `flex-direction: row-reverse;`}
    justify-content: center;
    align-items: center;
    gap: ${spacingByChar(0.5)};
    text-align: center;
    white-space: nowrap;
    border-radius: ${radius.m};

    /* ボタンの高さを合わせるために指定 */
    border: ${border.lineWidth} ${border.lineStyle} transparent;
    padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
    font-family: inherit;
    font-size: ${fontSize.M};
    font-weight: bold;
    line-height: ${leading.NONE};
    ${wide && 'width: 100%;'}

    &.square {
      padding: ${spacingByChar(0.75)};
    }

    &.s {
      padding: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};

      /* ボタンラベルの line-height を 0 にしたため、高さを担保する */
      min-height: calc(${fontSize.S} + ${spacingByChar(1)} + (${border.lineWidth} * 2));
    }

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    /* baseline より下の leading などの余白を埋める */
    .smarthr-ui-Icon,
    svg {
      display: block;
    }
  `;
});
const Button = styled_components_1.default.button(({ variant, themes }) => {
    const styles = variantStyles(variant, themes);
    return (0, styled_components_1.css) `
    ${baseStyles}
    ${styles.default}

    &:focus-visible,
    &:hover {
      ${styles.focus}
    }
    &[disabled] {
      cursor: not-allowed;
      ${styles.disabled}

      /* alpha color を使用しているので、背景色と干渉させない */
      background-clip: padding-box;
    }
  `;
});
const Anchor = styled_components_1.default.a(({ variant, themes }) => {
    const styles = variantStyles(variant, themes);
    return (0, styled_components_1.css) `
    ${baseStyles}
    ${styles.default}
    text-decoration: none;

    &:focus-visible,
    &:hover {
      ${styles.focus}
    }
    &:not([href]) {
      cursor: not-allowed;
      ${styles.disabled}

      /* alpha color を使用しているので、背景色と干渉させない */
      background-clip: padding-box;
    }
  `;
});
function variantStyles(variant, theme) {
    const { color } = theme;
    switch (variant) {
        case 'primary':
            return {
                default: (0, styled_components_1.css) `
          border-color: ${color.MAIN};
          background-color: ${color.MAIN};
          color: ${color.TEXT_WHITE};
        `,
                focus: (0, styled_components_1.css) `
          border-color: ${color.hoverColor(color.MAIN)};
          background-color: ${color.hoverColor(color.MAIN)};
        `,
                disabled: (0, styled_components_1.css) `
          border-color: ${color.disableColor(color.MAIN)};
          background-color: ${color.disableColor(color.MAIN)};
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
            };
        case 'secondary':
            return {
                default: (0, styled_components_1.css) `
          border-color: ${color.BORDER};
          background-color: ${color.WHITE};
          color: ${color.TEXT_BLACK};
        `,
                focus: (0, styled_components_1.css) `
          border-color: ${color.hoverColor(color.BORDER)};
          background-color: ${color.hoverColor(color.WHITE)};

          @media (prefers-contrast: more) {
            & {
              border-color: ${color.TEXT_BLACK};
            }
          }
        `,
                disabled: (0, styled_components_1.css) `
          border-color: ${color.disableColor(color.BORDER)};
          background-color: ${color.hoverColor(color.WHITE)};
          color: ${color.TEXT_DISABLED};
        `,
            };
        case 'danger':
            return {
                default: (0, styled_components_1.css) `
          border-color: ${color.DANGER};
          background-color: ${color.DANGER};
          color: ${color.TEXT_WHITE};
        `,
                focus: (0, styled_components_1.css) `
          border-color: ${color.hoverColor(color.DANGER)};
          background-color: ${color.hoverColor(color.DANGER)};
        `,
                disabled: (0, styled_components_1.css) `
          border-color: ${color.disableColor(color.DANGER)};
          background-color: ${color.disableColor(color.DANGER)};
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
            };
        case 'skeleton':
            return {
                default: (0, styled_components_1.css) `
          border-color: ${color.WHITE};
          background-color: transparent;
          color: ${color.TEXT_WHITE};
        `,
                focus: (0, styled_components_1.css) `
          border-color: ${color.hoverColor(color.WHITE)};
          background-color: ${color.OVERLAY};
          color: ${color.hoverColor(color.TEXT_WHITE)};
        `,
                disabled: (0, styled_components_1.css) `
          border-color: ${color.disableColor(color.WHITE)};
          background-color: transparent;
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
            };
        case 'text':
            return {
                default: (0, styled_components_1.css) `
          background-color: transparent;
          color: ${color.TEXT_BLACK};
        `,
                focus: (0, styled_components_1.css) `
          background-color: ${color.hoverColor(color.WHITE)};
        `,
                disabled: (0, styled_components_1.css) `
          border-color: transparent;
          background-color: transparent;
          color: ${color.TEXT_DISABLED};
        `,
            };
    }
}
//# sourceMappingURL=ButtonWrapper.js.map