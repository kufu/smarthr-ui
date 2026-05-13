import { Stack } from '../../Layout'
import { StatusLabel } from '../StatusLabel'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/StatusLabel',
  component: StatusLabel,
  render: (args) => <StatusLabel {...args} />,
  args: {
    children: 'ステータスラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof StatusLabel>

export const Playground: StoryObj<typeof StatusLabel> = {
  args: {},
}

export const Type: StoryObj<typeof StatusLabel> = {
  name: 'type',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'grey', 'blue', 'green', 'red', 'warning', 'error'].map((type) => (
        <StatusLabel {...args} type={type as any} key={type} />
      ))}
    </Stack>
  ),
}

export const Bold: StoryObj<typeof StatusLabel> = {
  name: 'bold',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, 'grey', 'blue', 'green', 'red', 'warning', 'error'].map((type) => (
        <StatusLabel {...args} type={type as any} bold key={type} />
      ))}
    </Stack>
  ),
}
