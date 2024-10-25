import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Reel } from '../Layout'

const tabBar = tv({
  slots: {
    wrapper: 'smarthr-ui-TabBar',
    inner: 'shr-grow',
  },
  variants: {
    bordered: {
      true: {
        inner: [
          'shr-relative',
          'before:shr-absolute before:shr-inset-x-0 before:shr-bottom-0 before:shr-border-b-shorthand before:shr-content-[""] before:shr-z-1',
        ],
      },
    },
  },
})

type Props = PropsWithChildren<{
  /** `true` のとき、TabBar に下線を表示する */
  bordered?: boolean
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props | 'role'>

export const TabBar: FC<Props & ElementProps> = ({
  className,
  bordered = true,
  children,
  ...props
}) => {
  const { wrapperStyle, innerStyle } = useMemo(() => {
    const { wrapper, inner } = tabBar()
    return {
      wrapperStyle: wrapper({ className }),
      innerStyle: inner({ bordered }),
    }
  }, [bordered, className])

  return (
    <Reel {...props} role="tablist" className={wrapperStyle}>
      <div className={innerStyle}>{children}</div>
    </Reel>
  )
}
