import React from 'react'

import { Cluster } from '../Layout'
import { Text } from '../Text'

const wrapperClassName = 'shr-text-base'

type Props = {
  start: number
  end: number
  total?: number
}

export const PageCounter: React.FC<Props> = ({ start, end, total = 0 }) => (
    <Cluster inline align="baseline" className={wrapperClassName}>
      {total > 0 && (
        <Cluster as="span" gap={0.25} inline align="baseline" className={wrapperClassName}>
          <Text weight="bold" as="b">
            {total.toLocaleString()}
          </Text>
          件中
        </Cluster>
      )}
      <Cluster as="span" gap={0.25} inline align="baseline" className={wrapperClassName}>
        <Text weight="bold" as="b">
          {start.toLocaleString()}
        </Text>
        –
        <Text weight="bold" as="b">
          {end.toLocaleString()}
        </Text>
        件
      </Cluster>
    </Cluster>
  )
