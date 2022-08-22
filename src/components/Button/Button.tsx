import React, { ButtonHTMLAttributes, forwardRef } from 'react'

import { BaseProps } from './types'
import { useClassNames } from './useClassNames'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'
import { Loader } from '../Loader'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps>(
  (
    {
      type = 'button',
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      className = '',
      children,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const classNames = useClassNames().button

    const actualPrefix = loading ? <Loader size="s" type="light" /> : prefix
    const disabledOnLoading = loading || disabled

    return (
      <ButtonWrapper
        {...props}
        type={type}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={`${className} ${classNames.wrapper}`}
        buttonRef={ref}
        disabled={disabledOnLoading}
      >
        <ButtonInner prefix={actualPrefix} suffix={suffix}>
          {children}
        </ButtonInner>
      </ButtonWrapper>
    )
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
