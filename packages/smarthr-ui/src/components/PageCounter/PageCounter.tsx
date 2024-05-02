import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'
import { RangeSeparator, Text } from '../Text'

import type { DecoratorType, DecoratorsType } from '../../types'

type Props = {
  start: number
  end: number
  total?: number
  decorators?: DecoratorsType<
    'unitForTotal' | 'unit' | 'rangeSeparator' | 'rangeSeparatorVisuallyHiddenText'
  >
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

const UNIT_TOTAL_TEXT = '件中'
const UNIT_TEXT = '件'
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
  const unitTotalText = useMemo(
    () => executeDecorator(UNIT_TOTAL_TEXT, decorators?.unitForTotal),
    [decorators?.unitForTotal],
  )
  const unitText = useMemo(() => executeDecorator(UNIT_TEXT, decorators?.unit), [decorators?.unit])
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
  const style = useMemo(() => pageCounter({ className }), [className])

  return (
    <Cluster {...props} inline align="baseline" className={style}>
      {total > 0 && (
        <Cluster as="span" gap={0.25} inline align="baseline">
          <Text weight="bold" as="b">
            {total.toLocaleString()}
          </Text>
          {unitTotalText}
        </Cluster>
      )}
      <Cluster as="span" gap={0.25} inline align="baseline">
        <Text weight="bold" as="b">
          {start.toLocaleString()}
        </Text>
        <RangeSeparator decorators={rangeSeparatorDecorators} />
        <Text weight="bold" as="b">
          {end.toLocaleString()}
        </Text>
        {unitText}
      </Cluster>
    </Cluster>
  )
}
