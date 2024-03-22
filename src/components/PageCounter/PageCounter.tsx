import React, { ComponentPropsWithoutRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'
import { Text } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { DecoratorType, DecoratorsType } from '../../types'

type Props = {
  start: number
  end: number
  total?: number
  decorators?: DecoratorsType<'unitForTotal' | 'unit'> & {
    rangeSeparator?: string
  }
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

const UNIT_TOTAL_TEXT = '件中'
const UNIT_TEXT = '件'
const RANGE_SEPARATOR = 'から'

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
  const rangeSeparator = decorators?.rangeSeparator ?? RANGE_SEPARATOR

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
        <VisuallyHiddenText>{rangeSeparator}</VisuallyHiddenText>
        <span aria-hidden="true">–</span>
        <Text weight="bold" as="b">
          {end.toLocaleString()}
        </Text>
        {unitText}
      </Cluster>
    </Cluster>
  )
}
