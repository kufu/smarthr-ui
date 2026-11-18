import { type ComponentPropsWithRef, type ReactElement, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { TimelineItem } from './TimelineItem'
import type { ExtendElementPropsWithRef } from '../../types'

type TimelineItem = ReactElement<ComponentPropsWithRef<typeof TimelineItem>>

type Props = ExtendElementPropsWithRef<
  'ol',
  {
    children: TimelineItem | TimelineItem[]
  }
>

const classNameGenerator = tv({
  base: 'shr-list-none',
})

export const Timeline: React.FC<Props> = ({ className, children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <ol {...rest} className={actualClassName}>
      {children}
    </ol>
  )
}
