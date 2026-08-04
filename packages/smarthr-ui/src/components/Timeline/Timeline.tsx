import { type ComponentProps, type ReactElement, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { TimelineItem } from './TimelineItem'

type TimelineItem = ReactElement<ComponentProps<typeof TimelineItem>>

type BaseProps = {
  children: TimelineItem | TimelineItem[]
}
type Props = BaseProps & Omit<ComponentProps<'ol'>, keyof BaseProps>

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
