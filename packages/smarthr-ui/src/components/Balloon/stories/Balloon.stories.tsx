import { Balloon } from '../Balloon'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Balloon',
  component: Balloon,
  render: (args) => <Balloon {...args}>バルーン</Balloon>,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Balloon>

export const Playground: StoryObj<typeof Balloon> = {}

export const As: StoryObj<typeof Balloon> = {
  name: 'as',
  args: {
    as: 'span',
  },
}
