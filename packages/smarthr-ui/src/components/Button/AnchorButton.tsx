import React, { AnchorHTMLAttributes, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { ButtonInner } from './ButtonInner'
import { ButtonWrapper } from './ButtonWrapper'
import { BaseProps } from './types'

type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

const anchorButton = tv({
  base: 'smarthr-ui-AnchorButton',
})

export const AnchorButton = forwardRef<HTMLAnchorElement, BaseProps & ElementProps>(
  (
    {
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      target,
      rel,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const styles = useMemo(() => anchorButton({ className }), [className])
    const actualRel = useMemo(
      () => (rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel),
      [rel, target],
    )

    return (
      <ButtonWrapper
        {...props}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={styles}
        target={target}
        rel={actualRel}
        isAnchor
        anchorRef={ref}
      >
        <ButtonInner prefix={prefix} suffix={suffix} size={size}>
          {children}
        </ButtonInner>
      </ButtonWrapper>
    )
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
AnchorButton.displayName = 'AnchorButton'
