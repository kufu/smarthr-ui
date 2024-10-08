import { fireEvent, within } from '@storybook/test'
import React from 'react'

import { Cluster, Stack } from '../../Layout'
import { Badge } from '../Badge'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/Badge/VRT',
  /* ペアワイズ法は使わずにすべての組み合わせを網羅する */
  render: (args: any) => {
    const types = ['grey', 'blue', 'red', 'yellow'] as const
    return (
      <Stack {...args} style={{ padding: '1rem' }}>
        {types.map((type, i) => (
          <Cluster key={i}>
            <>
              <Badge type={type} count={0} showZero={false} />
              <Badge type={type} count={0} showZero={true} />
              <Badge type={type} count={1} />
              <Badge type={type} count={10} overflowCount={10} />
              <Badge type={type} count={10} overflowCount={9} />
              <Badge type={type} dot={true} />
            </>
          </Cluster>
        ))}
      </Stack>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
