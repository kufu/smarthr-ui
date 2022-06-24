import React, { ButtonHTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react'

import { BaseProps } from './types'
import { useClassNames } from './useClassNames'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'

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
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    useImperativeHandle<HTMLButtonElement | null, HTMLButtonElement | null>(
      ref,
      () => buttonRef.current,
    )
    const classNames = useClassNames().button

    return (
      <ButtonWrapper
        {...props}
        type={type}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={`${className} ${classNames.wrapper}`}
        buttonRef={buttonRef}
      >
        <ButtonInner prefix={prefix} suffix={suffix}>
          {children}
        </ButtonInner>
      </ButtonWrapper>
    )
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
