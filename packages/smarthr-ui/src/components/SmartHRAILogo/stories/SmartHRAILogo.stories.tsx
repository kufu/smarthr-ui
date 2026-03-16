import { SmartHRAILogo } from '../SmartHRAILogo'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SmartHRAILogo',
  component: SmartHRAILogo,
  render: (args) => <SmartHRAILogo {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SmartHRAILogo>

export const Playground: StoryObj<typeof SmartHRAILogo> = {}

export const Alt: StoryObj<typeof SmartHRAILogo> = {
  name: 'alt',
  args: {
    alt: 'SmartHR（スマートHR） AIロゴ',
  },
}

export const Width: StoryObj<typeof SmartHRAILogo> = {
  name: 'width',
  args: {
    width: '5em',
  },
}

export const Height: StoryObj<typeof SmartHRAILogo> = {
  name: 'height',
  args: {
    height: '2em',
  },
}
