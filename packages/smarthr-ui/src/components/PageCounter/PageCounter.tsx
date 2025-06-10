import { type ComponentPropsWithoutRef, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { Cluster } from '../Layout'
import { RangeSeparator } from '../RangeSeparator'
import { Text } from '../Text'

type Props = {
  start: number
  end: number
  total?: number
  decorators?: DecoratorsType<DecoratorKeyTypes>
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const DECORATOR_DEFAULT_TEXTS = {
  rangeSeparator: '–',
  rangeSeparatorVisuallyHiddenText: 'から',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

const classNameGenerator = tv({ base: 'shr-text-base' })

export const PageCounter = memo<Props & ElementProps>(
  ({ start, end, total, decorators, className, ...props }) => {
    const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
    const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)
    const rangeSeparatorDecorators = useMemo(
      () => ({
        text: () => decorated.rangeSeparator,
        visuallyHiddenText: () => decorated.rangeSeparatorVisuallyHiddenText,
      }),
      [decorated],
    )

    return (
      <Cluster {...props} gap={0.25} inline align="baseline" className={actualClassName}>
        <BoldNumber>{start}</BoldNumber>
        <RangeSeparator decorators={rangeSeparatorDecorators} />
        <BoldNumber>{end}</BoldNumber>
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
