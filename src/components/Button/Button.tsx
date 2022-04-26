import React, { ButtonHTMLAttributes, VFC } from 'react'

import { BaseProps } from './types'
import { useClassNames } from './useClassNames'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const Button: VFC<BaseProps & ElementProps> = ({
  size = 'default',
  square = false,
  prefix,
  suffix,
  wide = false,
  variant = 'secondary',
  className = '',
  children,
  ...props
}) => {
  const classNames = useClassNames().button

  return (
    <ButtonWrapper
      {...props}
      size={size}
      square={square}
      wide={wide}
      variant={variant}
      className={`${className} ${classNames.wrapper}`}
    >
      <ButtonInner prefix={prefix} suffix={suffix}>
        {children}
      </ButtonInner>
    </ButtonWrapper>
  )
}
