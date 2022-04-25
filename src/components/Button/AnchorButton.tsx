import React, { AnchorHTMLAttributes, VFC } from 'react'

import { BaseProps } from './types'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

export const AnchorButton: VFC<BaseProps & ElementProps> = ({
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
  return (
    <ButtonWrapper
      {...props}
      size={size}
      square={square}
      wide={wide}
      variant={variant}
      className={className}
      isAnchor
    >
      <ButtonInner prefix={prefix} suffix={suffix}>
        {children}
      </ButtonInner>
    </ButtonWrapper>
  )
}
