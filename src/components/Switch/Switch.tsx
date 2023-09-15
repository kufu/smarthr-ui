import React, { InputHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaCheckIcon } from '../Icon'

type Props = InputHTMLAttributes<HTMLInputElement>

export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ disabled, className, ...props }, ref) => {
    const theme = useTheme()
    return (
      <Wrapper $disabled={disabled} themes={theme} className={className}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <Checkbox {...props} disabled={disabled} type="checkbox" role="switch" ref={ref} />
        <CheckIcon themes={theme} />
      </Wrapper>
    )
  },
)

const Wrapper = styled.span<{ $disabled: Props['disabled']; themes: Theme }>`
  ${({ $disabled, themes: { border, color, radius, shadow } }) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 1.25rem;
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    /* 理想的には padding が2pxだが、box-shadow は outline で使用しているため、border と padding で2pxの疑似余白を作っている。 */
    padding: 1px;

    /* :focus-visible-within の代替 */
    :has(:focus-visible) {
      ${shadow.focusIndicatorStyles}
    }

    ::before,
    ::after {
      content: '';
      box-sizing: border-box;
      display: inline-block;
      border-radius: ${radius.full};
      border: ${border.shorthand};
      border-color: ${color.GREY_30};
      background-color: ${color.GREY_30};
      block-size: 1rem;
      inline-size: 1rem;
      transition-property: transform, scale;
      transition-duration: 150ms;
      transition-timing-function: ease-out;
      /* transition: transform 150ms ease-out; */
    }

    ::before {
      scale: ${2 / 3};
    }

    /* ツマミが移動する余白のために存在している */
    ::after {
      visibility: hidden;
    }

    :has(:checked) {
      border-color: ${color.MAIN};
      background-color: ${color.MAIN};

      ::before {
        scale: unset;
        transform: translateX(1rem);
        border-color: ${color.BORDER};
        background-color: ${color.WHITE};
      }
    }

    ${$disabled &&
    css`
      &&& {
        cursor: unset;
        border-color: ${color.BORDER};
        background-color: ${color.BORDER};
      }
    `}

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

// eslint-disable-next-line smarthr/a11y-prohibit-input-placeholder, smarthr/a11y-input-has-name-attribute
const Checkbox = styled.input`
  position: absolute;
  inset: 0;
  cursor: pointer;
  outline: none;
  opacity: 0;

  :disabled {
    cursor: revert;
  }

  @supports not selector(:has(+ *)) {
    position: revert;
    opacity: revert;
    outline: revert;
  }
`

const CheckIcon = styled(FaCheckIcon).attrs({ color: 'WHITE', size: 'XXS' })<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => css`
    position: absolute;
    display: none;

    @supports selector(:has(+ *)) {
      [type='checkbox']:checked ~ & {
        display: unset;
        transform: translateX(calc((1rem - ${fontSize.XXS}) / 2));
        pointer-events: none;
      }
    }
  `}
`
