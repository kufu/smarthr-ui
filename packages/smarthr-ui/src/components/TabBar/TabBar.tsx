import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Reel } from '../Layout'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-TabBar',
    inner: 'shr-grow',
  },
  variants: {
    bordered: {
      true: {
        inner: [
          'shr-relative',
          'before:shr-border-b-shorthand before:shr-absolute before:shr-inset-x-0 before:shr-bottom-0 before:shr-z-1 before:shr-content-[""]',
        ],
      },
    },
  },
})

type AbstractProps = PropsWithChildren<{
  /** `true` のとき、TabBar に下線を表示する */
  bordered?: boolean
}>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'div'>, keyof AbstractProps | 'role'>

export const TabBar: FC<Props> = ({ className, bordered, children, ...rest }) => {
  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      inner: inner({ bordered: bordered ?? true }),
    }
  }, [bordered, className])

  return (
    <Reel {...rest} role="tablist" className={classNames.wrapper}>
      <div className={classNames.inner}>{children}</div>
    </Reel>
  )
}
