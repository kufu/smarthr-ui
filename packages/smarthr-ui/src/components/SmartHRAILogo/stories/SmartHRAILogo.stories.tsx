import type { Meta, StoryObj } from '@storybook/react'
import { SmartHRAILogo } from '../SmartHRAILogo'

export default {
  title: 'Media（メディア）/SmartHRAILogo',
  component: SmartHRAILogo,
  render: (args) => <SmartHRAILogo {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SmartHRAILogo>

export const Playground: StoryObj<typeof SmartHRAILogo> = {
  args: {},
}

export const alt: StoryObj<typeof SmartHRAILogo> = {
  name: 'alt',
  args: {
    alt: 'SmartHR（スマートHR） AI',
  },
}

export const width: StoryObj<typeof SmartHRAILogo> = {
  name: 'width',
  args: {
    width: 200,
  },
}

export const height: StoryObj<typeof SmartHRAILogo> = {
  name: 'height',
  args: {
    height: 200,
  },
}
