import { type ComponentPropsWithoutRef, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'
import { Text } from '../Text'

type AbstractProps = {
  start: number
  end: number
  total?: number
}
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'div'>, keyof AbstractProps>

const classNameGenerator = tv({ base: 'shr-text-base' })

export const PageCounter = memo<Props>(({ start, end, total, className, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Cluster {...rest} gap={0.25} inline align="baseline" className={actualClassName}>
      {/* eslint-disable-next-line smarthr/require-i18n-text */}
      <BoldNumber>{start}</BoldNumber>–<BoldNumber>{end}</BoldNumber>
      <Total>{total}</Total>
    </Cluster>
  )
})

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
