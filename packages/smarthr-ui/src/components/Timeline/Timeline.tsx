import { type ComponentProps, type ReactElement, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { TimelineItem } from './TimelineItem'

type TimelineItem = ReactElement<ComponentProps<typeof TimelineItem>>

type Props = {
  children: TimelineItem | TimelineItem[]
}
type ElementProps = Omit<ComponentProps<'ol'>, keyof Props>

const classNameGenerator = tv({
  base: 'shr-list-none',
})

export const Timeline: React.FC<Props & ElementProps> = ({ className, children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  return (
    <ol {...rest} className={actualClassName}>
      {children}
    </ol>
  )
}
