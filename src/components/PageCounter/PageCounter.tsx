import React, { ReactNode, useMemo } from 'react'

import { Cluster } from '../Layout'
import { Text } from '../Text'

import type { DecoratorType, DecoratorsType } from '../../types'

type Props = {
  start: number
  end: number
  total?: number
  decorators?: DecoratorsType<'unitForTotal' | 'unit'> & {
    rangeSeparator?: string
  }
}

type ExecuteDecoratorReturn<T extends DecoratorType | string | undefined> = T extends DecoratorType
  ? ReactNode
  : string

const executeDecorator = <T extends DecoratorType | string | undefined>(
  defaultText: string,
  decorator: T,
): ExecuteDecoratorReturn<T> => {
  if (decorator === undefined) return defaultText

  if (typeof decorator === 'string') return decorator

  return decorator(defaultText) as ExecuteDecoratorReturn<T>
}

const UNIT_TOTAL_TEXT = '件中'
const UNIT_TEXT = '件'
const RANGE_SEPARATOR = 'から'

export const PageCounter: React.FC<Props> = ({ start, end, total = 0, decorators }) => {
  const unitTotalText = useMemo(
    () => executeDecorator(UNIT_TOTAL_TEXT, decorators?.unitForTotal),
    [decorators?.unitForTotal],
  )
  const unitText = useMemo(() => executeDecorator(UNIT_TEXT, decorators?.unit), [decorators?.unit])
  const rangeSeparator = useMemo(
    () => executeDecorator(RANGE_SEPARATOR, decorators?.rangeSeparator),
    [decorators?.rangeSeparator],
  )

  return (
    <Cluster inline align="baseline" className="shr-text-base">
      {total > 0 && (
        <Cluster as="span" gap={0.25} inline align="baseline" className="shr-text-base">
          <Text weight="bold" as="b">
            {total.toLocaleString()}
          </Text>
          {unitTotalText}
        </Cluster>
      )}
      <Cluster as="span" gap={0.25} inline align="baseline" className="shr-text-base">
        <Text weight="bold" as="b">
          {start.toLocaleString()}
        </Text>
        <span title={rangeSeparator}>
          –
        </span>
        <Text weight="bold" as="b">
          {end.toLocaleString()}
        </Text>
        {unitText}
      </Cluster>
    </Cluster>
  )
}
