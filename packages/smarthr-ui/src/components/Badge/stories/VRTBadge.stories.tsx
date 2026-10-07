import { Cluster, Stack } from '../../Layout'
import { Badge } from '../Badge'

import type { StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Badge/VRT',
  /* ペアワイズ法は使わずにすべての組み合わせを網羅する */
  render: (args: any) => {
    const colors = ['grey', 'blue', 'red', 'yellow'] as const
    return (
      <Stack {...args} style={{ padding: '1rem' }}>
        {colors.map((color, i) => (
          <Cluster key={i}>
            <>
              <Badge count={0} showZero={false} color={color} />
              <Badge count={0} showZero={true} color={color} />
              <Badge count={1} color={color} />
              <Badge count={10} overflowCount={10} color={color} />
              <Badge count={10} overflowCount={9} color={color} />
              <Badge dot={true} color={color} />
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
