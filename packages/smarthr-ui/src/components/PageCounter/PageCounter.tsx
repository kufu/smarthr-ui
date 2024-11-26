import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'
import { RangeSeparator, Text } from '../Text'

import type { DecoratorType, DecoratorsType } from '../../types'

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
  total = 0,
  decorators,
  className,
  ...props
}) => {
  const rangeSeparatorDecorators = useMemo(
    () => ({
      text: () => executeDecorator(RANGE_SEPARATOR, decorators?.rangeSeparator),
      visuallyHiddenText: () =>
        executeDecorator(
          RANGE_SEPARATOR_VISUALLY_HIDDEN_TEXT,
          decorators?.rangeSeparatorVisuallyHiddenText,
        ),
    }),
    [decorators?.rangeSeparator, decorators?.rangeSeparatorVisuallyHiddenText],
  )

  return (
    <Cluster {...props} gap={0.25} inline align="baseline" className={pageCounter({ className })}>
      <Text weight="bold" as="b">
        {start.toLocaleString()}
      </Text>
      <RangeSeparator decorators={rangeSeparatorDecorators} />
      <Text weight="bold" as="b">
        {end.toLocaleString()}
      </Text>
      {total > 0 && (
        <>
          <span>/</span>
          <Text weight="bold" as="b">
            {total.toLocaleString()}
          </Text>
        </>
      )}
    </Cluster>
  )
}
