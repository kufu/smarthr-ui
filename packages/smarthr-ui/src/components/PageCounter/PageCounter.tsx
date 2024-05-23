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
    | 'before'
    | 'after'
    | 'betweenTotalAndRange'
    | 'beforeTotal'
    | 'afterTotal'
    | 'unit'
    | 'beforeRange'
    | 'afterRange'
    | 'rangeSeparator'
    | 'rangeSeparatorVisuallyHiddenText'
  >
  visibleOrder?: {
    total: number
    range: number
  }
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

const VISIBLE_ORDER: Props['visibleOrder'] = {
  total: 0,
  range: 1,
}
const NULL_TEXT = ''
const AFTER_TOTAL_TEXT = '件中'
const UNIT_TEXT = '件'
const RANGE_SEPARATOR = '–'
const RANGE_SEPARATOR_VISUALLY_HIDDEN_TEXT = 'から'

const pageCounter = tv({ base: 'shr-text-base' })

export const PageCounter: React.FC<Props & ElementProps> = ({
  start,
  end,
  total = 0,
  visibleOrder = VISIBLE_ORDER,
  decorators,
  className,
  ...props
}) => {
  const beforeText = useMemo(
    () => executeDecorator(NULL_TEXT, decorators?.before),
    [decorators?.before],
  )
  const afterText = useMemo(
    () => executeDecorator(NULL_TEXT, decorators?.after),
    [decorators?.after],
  )
  const betweenTotalAndRangeText = useMemo(
    () => executeDecorator(NULL_TEXT, decorators?.betweenTotalAndRange),
    [decorators?.betweenTotalAndRange],
  )
  const beforeTotalText = useMemo(
    () => executeDecorator(NULL_TEXT, decorators?.beforeTotal),
    [decorators?.beforeTotal],
  )
  const afterTotalText = useMemo(
    () => executeDecorator(AFTER_TOTAL_TEXT, decorators?.afterTotal),
    [decorators?.afterTotal],
  )
  const unitText = useMemo(() => executeDecorator(UNIT_TEXT, decorators?.unit), [decorators?.unit])
  const beforeRangeText = useMemo(
    () => executeDecorator(NULL_TEXT, decorators?.beforeRange),
    [decorators?.beforeRange],
  )
  const afterRangeText = useMemo(
    () => executeDecorator(NULL_TEXT, decorators?.afterRange),
    [decorators?.afterRange],
  )

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

  const totalElement =
    total > 0 ? (
      <Cluster as="span" gap={0.25} inline align="baseline">
        {beforeTotalText}
        <Text weight="bold" as="b">
          {total.toLocaleString()}
        </Text>
        {afterTotalText}
      </Cluster>
    ) : null
  const rangeElemnt = (
    <Cluster as="span" gap={0.25} inline align="baseline">
      {beforeRangeText}
      <Text weight="bold" as="b">
        {start.toLocaleString()}
      </Text>
      <RangeSeparator decorators={rangeSeparatorDecorators} />
      <Text weight="bold" as="b">
        {end.toLocaleString()}
      </Text>
      {unitText}
      {afterRangeText}
    </Cluster>
  )
  const elements =
    visibleOrder.total <= visibleOrder.range
      ? [totalElement, rangeElemnt]
      : [rangeElemnt, totalElement]

  return (
    <Cluster {...props} inline align="baseline" className={style}>
      {beforeText}
      {elements[0]}
      {betweenTotalAndRangeText}
      {elements[1]}
      {afterText}
    </Cluster>
  )
}
