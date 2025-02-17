import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorType, type DecoratorsType } from '../../hooks/useDecorators'
import { Cluster } from '../Layout'
import { RangeSeparator, Text } from '../Text'

type Props = {
  start: number
  end: number
  total?: number
  decorators?: DecoratorsType<'rangeSeparator' | 'rangeSeparatorVisuallyHiddenText'>
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

const RANGE_SEPARATOR = '–'
const RANGE_SEPARATOR_VISUALLY_HIDDEN_TEXT = 'から'

const pageCounter = tv({ base: 'shr-text-base' })

export const PageCounter: React.FC<Props & ElementProps> = ({
  start,
  end,
  total,
  decorators,
  className,
  ...props
}) => {
  const rangeSeparatorDecorators = useMemo(() => {
    if (!decorators) {
      return {
        text: () => RANGE_SEPARATOR,
        visuallyHiddenText: () => RANGE_SEPARATOR_VISUALLY_HIDDEN_TEXT,
      }
    }

    return {
      text: () => executeDecorator(RANGE_SEPARATOR, decorators.rangeSeparator),
      visuallyHiddenText: () =>
        executeDecorator(
          RANGE_SEPARATOR_VISUALLY_HIDDEN_TEXT,
          decorators.rangeSeparatorVisuallyHiddenText,
        ),
    }
  }, [decorators])

  return (
    <Cluster {...props} gap={0.25} inline align="baseline" className={pageCounter({ className })}>
      <BoldNumber>{start}</BoldNumber>
      <RangeSeparator decorators={rangeSeparatorDecorators} />
      <BoldNumber>{end}</BoldNumber>
      <Total>{total}</Total>
    </Cluster>
  )
}

const BoldNumber = React.memo<{ children: number }>(({ children }) => (
  <Text weight="bold" as="b">
    {children.toLocaleString()}
  </Text>
))

const Total = React.memo<{ children: number | undefined }>(
  ({ children = 0 }) =>
    children > 0 && (
      <>
        <span>/</span>
        <BoldNumber>{children}</BoldNumber>
      </>
    ),
)
