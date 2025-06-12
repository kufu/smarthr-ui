import type { Meta, StoryObj } from '@storybook/react'
import { SmartHRAILogo } from '../SmartHRAILogo'

export default {
  title: 'Components/SmartHRAILogo',
  component: SmartHRAILogo,
  render: (args) => <SmartHRAILogo {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SmartHRAILogo>

export const Playground: StoryObj<typeof SmartHRAILogo> = {}

export const alt: StoryObj<typeof SmartHRAILogo> = {
  name: 'alt',
  args: {
    alt: 'SmartHR（スマートHR） AIロゴ',
  },
}

export const width: StoryObj<typeof SmartHRAILogo> = {
  name: 'width',
  args: {
    width: '5em',
  },
}

export const height: StoryObj<typeof SmartHRAILogo> = {
  name: 'height',
  args: {
    height: '2em',
  },
}
