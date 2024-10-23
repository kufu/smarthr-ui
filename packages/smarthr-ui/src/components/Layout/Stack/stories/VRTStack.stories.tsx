import { Meta } from '@storybook/react'
import React from 'react'

import { Cluster, Stack } from '../../../..'
import { Gap } from '../../../../types'
import { ColorBox } from '../../ComponentsForStories'

export default {
  title: 'Layouts（レイアウト）/Stack/VRT',
  component: Stack,
  render: (args) => (
    <Cluster>
      {([0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 8] as Gap[]).map((gap) => (
        <Stack {...args} key={gap} gap={gap}>
          <ColorBox />
          <ColorBox />
          <ColorBox />
          <ColorBox />
        </Stack>
      ))}
    </Cluster>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Stack>

export const VRT = {}
