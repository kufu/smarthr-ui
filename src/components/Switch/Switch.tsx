import React, { InputHTMLAttributes, forwardRef, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { tv } from 'tailwind-variants'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaCheckIcon } from '../Icon'

const switchStyles = tv({
  slots: {
    wrapper: [
      'shr-border-shorthand shr-relative shr-inline-flex shr-items-center shr-bg-white',
      /* 理想的には padding: 2px; だが、box-shadow を outline で使用しているため、border と padding で2pxの疑似余白を作っている。 */
      'shr-p-px',
      'has-[:focus-visible]-shr-shadow-focusIndicatorStyles',
      'before:shr-bg-[theme(colors.grey.30) before:shr-border-[theme(colors.grey.30) shr-transition-[transform,scale] shr-duration-150 shr-ease-out before:shr-border-shorthand before:shr-box-border before:shr-inline-block before:shr-size-[theme(fontSize.base)] before:shr-scale-[2/3] before:shr-rounded-full before:shr-content-[""]',
      'after:shr-bg-[theme(colors.grey.30) after:shr-border-[theme(colors.grey.30) shr-transition-[transform,scale] shr-duration-150 shr-ease-out after:shr-border-shorthand after:shr-box-border after:shr-inline-block after:shr-size-[theme(fontSize.base)] after:shr-rounded-full after:shr-content-[""]',
      /* ツマミが移動する余白のために存在している */
      'after:shr-hidden',
      'has-[:checked]-shr-bg-main has-[:checked]-shr-border-main',
      'before:has-[:checked]-scale-unset before:has-[:checked]-shr-transform-[translateX(theme(fontSize.base))] before:has-[:checked]-shr-bg-white before:has-[:checked]-shr-border-[theme(colors.border)]',
    ],
    checkboxInput: [],
    checkIcon: [],
  },
  variants: {
    disabled: {
      wrapper: [],
    },
  },
})

type Props = InputHTMLAttributes<HTMLInputElement>

export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ disabled, className, ...props }, ref) => {
    const theme = useTheme()
    const { wrapperStyle, checkboxInputStyle, checkIconStyle } = useMemo(() => {
      const { wrapper, checkboxInput, checkIcon } = switchStyles()
      return {
        wrapperStyle: wrapper({ className }),
        checkboxInputStyle: checkboxInput,
        checkIconStyle: checkIcon,
      }
    }, [className])

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <CheckboxInput {...props} disabled={disabled} type="checkbox" role="switch" ref={ref} />
        <CheckIcon $themes={theme} />
      </span>
    )
  },
)

const Wrapper = styled.span<{ $disabled: Props['disabled']; themes: Theme }>`
  ${({ $disabled, themes: { border, color, fontSize, radius, shadow } }) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    /* TODO: どうかく？ */
    border-radius: calc(${fontSize.M} * 1.25);
    border: ${border.shorthand};
    background-color: ${color.WHITE};

    padding: 1px;

    /* :focus-visible-within の代替 */
    &:has(:focus-visible) {
      ${shadow.focusIndicatorStyles}
    }

    ::before,
    ::after {
      /* content: ''; */
      /* box-sizing: border-box; */
      /* display: inline-block; */
      /* border-radius: ${radius.full}; */
      /* border: ${border.shorthand}; */
      /* border-color: ${color.GREY_30}; */
      /* background-color: ${color.GREY_30}; */
      /* block-size: ${fontSize.M}; */
      /* inline-size: ${fontSize.M}; */
      /* transition-property: transform, scale; */
      /* transition-duration: 150ms; */
      /* transition-timing-function: ease-out; */
    }

    /* ::before {
      scale: ${2 / 3};
    } */

    /* ツマミが移動する余白のために存在している */
    /* ::after {
      visibility: hidden;
    }

    &:has(:checked) {
      border-color: ${color.MAIN};
      background-color: ${color.MAIN};

      ::before {
        scale: unset;
        transform: translateX(${fontSize.M});
        border-color: ${color.BORDER};
        background-color: ${color.WHITE};
      }
    } */

    ${$disabled &&
    css`
      &&& {
        cursor: unset;
        border-color: ${color.BORDER};
        background-color: ${color.BORDER};
      }
    `}

    @media (forced-colors: active) {
      ${$disabled
        ? css`
            &&& {
              border-color: GrayText;

              &::before,
              &::after {
                border-color: GrayText;
              }
            }
          `
        : css`
            /* ツマミを塗りつぶす https://developer.mozilla.org/en-US/docs/Web/CSS/system-color */
            &&&::before,
            &&&::after {
              background-color: ButtonBorder;
            }
          `}
    }

    @supports not selector(:has(+ *)) {
      border-style: revert;
      background-color: revert;

      ::before,
      ::after {
        display: none;
      }

      ${$disabled &&
      css`
        &&& {
          background-color: revert;
        }
      `}
    }
  `}
`

const CheckboxInput = styled.input`
  position: absolute;
  inset: 0;
  cursor: pointer;
  outline: none;
  opacity: 0;
  appearance: none;

  /* 古い iOS など inset が効かない環境で領域いっぱいに広げる */
  @supports not (inset: 0) {
    width: 100%;
    height: 100%;
  }

  :disabled {
    cursor: revert;
  }

  @supports not selector(:has(+ *)) {
    position: revert;
    opacity: revert;
    outline: revert;
    appearance: revert;
  }
`

const CheckIcon = styled(FaCheckIcon).attrs({ color: 'WHITE', size: 'XXS' })<{ $themes: Theme }>`
  ${({ $themes: { fontSize } }) => css`
    position: absolute;
    display: none;

    @supports selector(:has(+ *)) {
      [type='checkbox']:checked ~ & {
        display: unset;
        transform: translateX(calc((${fontSize.M} - ${fontSize.XXS}) / 2));
        pointer-events: none;
      }
    }

    /* 強制カラーモードの時に状態を判別するため */
    @media (forced-colors: active) {
      fill: ButtonText;

      [type='checkbox']:disabled ~ & {
        fill: GrayText;
      }
    }
  `}
`
