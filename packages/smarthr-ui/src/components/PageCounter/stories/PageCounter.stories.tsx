import { PageCounter } from '../PageCounter'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/PageCounter',
  component: PageCounter,
  render: (args) => <PageCounter {...args} />,
  args: {
    start: 1,
    end: 50,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof PageCounter>

export const Playground: StoryObj<typeof PageCounter> = {
  args: {},
}

export const Total: StoryObj<typeof PageCounter> = {
  name: 'total',
  args: {
    total: 5000,
  },
}
