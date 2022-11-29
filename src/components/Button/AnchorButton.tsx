import React, { AnchorHTMLAttributes, forwardRef } from 'react'

import { ButtonInner } from './ButtonInner'
import { ButtonWrapper } from './ButtonWrapper'
import { BaseProps } from './types'
import { useClassNames } from './useClassNames'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

export const AnchorButton = forwardRef<HTMLAnchorElement, BaseProps & ElementProps>(
  (
    {
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
    const classNames = useClassNames().anchorButton

    return (
      <ButtonWrapper
        {...props}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={`${className} ${classNames.wrapper}`}
        isAnchor
        anchorRef={ref}
      >
        <ButtonInner prefix={prefix} suffix={suffix}>
          {children}
        </ButtonInner>
      </ButtonWrapper>
    )
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
AnchorButton.displayName = 'AnchorButton'
