import { type ComponentPropsWithRef, type ReactElement, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { TimelineItem } from './TimelineItem'
import type { SHRComponentPropsWithRef } from '../../types'

type TimelineItem = ReactElement<ComponentPropsWithRef<typeof TimelineItem>>

type Props = SHRComponentPropsWithRef<
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
