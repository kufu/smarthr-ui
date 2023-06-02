import React, { useMemo, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
export function ButtonWrapper({ size, square, className, ...props }) {
    const theme = useTheme();
    const buttonClassName = useMemo(() => `${size} ${className} ${square ? 'square' : ''}`, [className, size, square]);
    return props.isAnchor ? (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    React.createElement(Anchor, { ...props, className: buttonClassName, ref: props.anchorRef, themes: theme })) : (React.createElement(Button, { ...props, className: buttonClassName, ref: props.buttonRef, themes: theme }));
}
const baseStyles = css(({ wide, $loading, themes }) => {
    const { border, fontSize, leading, radius, shadow, spacingByChar } = themes;
    return css `
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
const Button = styled.button(({ variant, themes }) => {
    const styles = variantStyles(variant, themes);
    return css `
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
const Anchor = styled.a(({ variant, themes }) => {
    const styles = variantStyles(variant, themes);
    return css `
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
                default: css `
          border-color: ${color.MAIN};
          background-color: ${color.MAIN};
          color: ${color.TEXT_WHITE};
        `,
                focus: css `
          border-color: ${color.hoverColor(color.MAIN)};
          background-color: ${color.hoverColor(color.MAIN)};
        `,
                disabled: css `
          border-color: ${color.disableColor(color.MAIN)};
          background-color: ${color.disableColor(color.MAIN)};
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
            };
        case 'secondary':
            return {
                default: css `
          border-color: ${color.BORDER};
          background-color: ${color.WHITE};
          color: ${color.TEXT_BLACK};
        `,
                focus: css `
          border-color: ${color.hoverColor(color.BORDER)};
          background-color: ${color.hoverColor(color.WHITE)};

          @media (prefers-contrast: more) {
            & {
              border-color: ${color.TEXT_BLACK};
            }
          }
        `,
                disabled: css `
          border-color: ${color.disableColor(color.BORDER)};
          background-color: ${color.hoverColor(color.WHITE)};
          color: ${color.TEXT_DISABLED};
        `,
            };
        case 'danger':
            return {
                default: css `
          border-color: ${color.DANGER};
          background-color: ${color.DANGER};
          color: ${color.TEXT_WHITE};
        `,
                focus: css `
          border-color: ${color.hoverColor(color.DANGER)};
          background-color: ${color.hoverColor(color.DANGER)};
        `,
                disabled: css `
          border-color: ${color.disableColor(color.DANGER)};
          background-color: ${color.disableColor(color.DANGER)};
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
            };
        case 'skeleton':
            return {
                default: css `
          border-color: ${color.WHITE};
          background-color: transparent;
          color: ${color.TEXT_WHITE};
        `,
                focus: css `
          border-color: ${color.hoverColor(color.WHITE)};
          background-color: ${color.OVERLAY};
          color: ${color.hoverColor(color.TEXT_WHITE)};
        `,
                disabled: css `
          border-color: ${color.disableColor(color.WHITE)};
          background-color: transparent;
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
            };
        case 'text':
            return {
                default: css `
          background-color: transparent;
          color: ${color.TEXT_BLACK};
        `,
                focus: css `
          background-color: ${color.hoverColor(color.WHITE)};
        `,
                disabled: css `
          border-color: transparent;
          background-color: transparent;
          color: ${color.TEXT_DISABLED};
        `,
            };
    }
}
//# sourceMappingURL=ButtonWrapper.js.map