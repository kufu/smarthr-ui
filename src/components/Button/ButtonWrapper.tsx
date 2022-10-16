import React, {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ForwardedRef,
  ReactNode,
  useMemo,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Variant } from './types'

type BaseProps = {
  size: 'default' | 's'
  square: boolean
  wide: boolean
  variant: Variant
  loading?: boolean
  className: string
  children: ReactNode
}

type ButtonProps = BaseProps & {
  isAnchor?: never
  buttonRef?: ForwardedRef<HTMLButtonElement>
}
type AnchorProps = BaseProps & {
  isAnchor: true
  anchorRef?: ForwardedRef<HTMLAnchorElement>
}
type Props =
  | (ButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonProps>)
  | (AnchorProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof AnchorProps>)

type StyleProps = Pick<Props, 'wide' | 'variant' | 'loading'> & { themes: Theme }

export function ButtonWrapper({ size, square, className, ...props }: Props) {
  const theme = useTheme()
  const buttonClassName = useMemo(
    () => `${size} ${className} ${square ? 'square' : ''}`,
    [className, size, square],
  )
  return props.isAnchor ? (
    <Anchor {...props} className={buttonClassName} ref={props.anchorRef} themes={theme} />
  ) : (
    <Button {...props} className={buttonClassName} ref={props.buttonRef} themes={theme} />
  )
}

const baseStyles = css<StyleProps>(({ wide, loading, themes }) => {
  const { border, fontSize, leading, radius, shadow, spacingByChar } = themes

  return css`
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    ${loading && `flex-direction: row-reverse;`}
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

    /* baseline より下の leading などの余白を埋める */
    .smarthr-ui-Icon,
    svg {
      display: block;
    }
  `
})

const Button = styled.button<StyleProps>(({ variant, themes }) => {
  const styles = variantStyles(variant, themes)
  return css`
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
  `
})

const Anchor = styled.a<StyleProps>(({ variant, themes }) => {
  const styles = variantStyles(variant, themes)
  return css`
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
  `
})

function variantStyles(variant: Variant, theme: Theme) {
  const { color } = theme
  switch (variant) {
    case 'primary':
      return {
        default: css`
          border-color: ${color.MAIN};
          background-color: ${color.MAIN};
          color: ${color.TEXT_WHITE};
        `,
        focus: css`
          border-color: ${color.hoverColor(color.MAIN)};
          background-color: ${color.hoverColor(color.MAIN)};
        `,
        disabled: css`
          border-color: ${color.disableColor(color.MAIN)};
          background-color: ${color.disableColor(color.MAIN)};
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
      }
    case 'secondary':
      return {
        default: css`
          border-color: ${color.BORDER};
          background-color: ${color.WHITE};
          color: ${color.TEXT_BLACK};
        `,
        focus: css`
          border-color: ${color.hoverColor(color.BORDER)};
          background-color: ${color.hoverColor(color.WHITE)};
        `,
        disabled: css`
          border-color: ${color.disableColor(color.BORDER)};
          background-color: ${color.hoverColor(color.WHITE)};
          color: ${color.TEXT_DISABLED};
        `,
      }
    case 'danger':
      return {
        default: css`
          border-color: ${color.DANGER};
          background-color: ${color.DANGER};
          color: ${color.TEXT_WHITE};
        `,
        focus: css`
          border-color: ${color.hoverColor(color.DANGER)};
          background-color: ${color.hoverColor(color.DANGER)};
        `,
        disabled: css`
          border-color: ${color.disableColor(color.DANGER)};
          background-color: ${color.disableColor(color.DANGER)};
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
      }
    case 'skeleton':
      return {
        default: css`
          border-color: ${color.WHITE};
          background-color: transparent;
          color: ${color.TEXT_WHITE};
        `,
        focus: css`
          border-color: ${color.hoverColor(color.WHITE)};
          background-color: ${color.OVERLAY};
          color: ${color.hoverColor(color.TEXT_WHITE)};
        `,
        disabled: css`
          border-color: ${color.disableColor(color.WHITE)};
          background-color: transparent;
          color: ${color.disableColor(color.TEXT_WHITE)};
        `,
      }
    case 'text':
      return {
        default: css`
          background-color: transparent;
          color: ${color.TEXT_BLACK};
        `,
        focus: css`
          background-color: ${color.hoverColor(color.WHITE)};
        `,
        disabled: css`
          background-color: transparent;
          color: ${color.TEXT_DISABLED};
        `,
      }
  }
}
