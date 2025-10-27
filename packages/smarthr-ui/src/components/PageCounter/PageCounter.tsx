import { type ComponentPropsWithoutRef, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'
import { Text } from '../Text'

type Props = {
  start: number
  end: number
  total?: number
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const classNameGenerator = tv({ base: 'shr-text-base' })

export const PageCounter = memo<Props & ElementProps>(
  ({ start, end, total, className, ...props }) => {
    const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

    return (
      <Cluster {...props} gap={0.25} inline align="baseline" className={actualClassName}>
        <BoldNumber>{start}</BoldNumber>–<BoldNumber>{end}</BoldNumber>
        <Total>{total}</Total>
      </Cluster>
    )
  },
)

const BoldNumber = memo<{ children: number }>(({ children }) => (
  <Text weight="bold" as="b">
    {children.toLocaleString()}
  </Text>
))

const Total = memo<{ children: number | undefined }>(
  ({ children = 0 }) =>
    children > 0 && (
      <>
        <span>/</span>
        <BoldNumber>{children}</BoldNumber>
      </>
    ),
)
