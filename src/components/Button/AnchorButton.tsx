import React, { AnchorHTMLAttributes, forwardRef, useImperativeHandle, useRef } from 'react'

import { BaseProps } from './types'
import { useClassNames } from './useClassNames'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'

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
    const anchorRef = useRef<HTMLAnchorElement>(null)
    useImperativeHandle<HTMLAnchorElement | null, HTMLAnchorElement | null>(
      ref,
      () => anchorRef.current,
    )
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
        anchorRef={anchorRef}
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
