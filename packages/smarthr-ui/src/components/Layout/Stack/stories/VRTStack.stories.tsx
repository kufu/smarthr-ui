import { Meta } from '@storybook/react'
import React from 'react'

import { Cluster, Stack } from '../../../..'
import { ColorBox } from '../../ComponentsForStories'

export default {
  title: 'Layouts（レイアウト）/Stack/VRT',
  component: Stack,
  render: (args) => (
    <Cluster>
      <Stack {...args} gap={0.25}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={0.5}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={0.75}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={1}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={1.25}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={1.5}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={2}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={2.5}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={3}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={4}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
      <Stack {...args} gap={8}>
        <ColorBox />
        <ColorBox />
        <ColorBox />
        <ColorBox />
      </Stack>
    </Cluster>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Stack>

export const VRT = {}
