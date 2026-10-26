import { Stack } from '../../Layout'
import { SmartHRAILogo } from '../SmartHRAILogo'

import type { Meta, StoryObj } from '@storybook/react-vite'

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

export const Compact: StoryObj<typeof SmartHRAILogo> = {
  name: 'compact',
  render: (args) => (
    <Stack inline align="start">
      {([undefined, true, false] as const).map((compact) => (
        <SmartHRAILogo {...args} key={String(compact)} compact={compact} />
      ))}
    </Stack>
  ),
}

export const Fill: StoryObj<typeof SmartHRAILogo> = {
  name: 'fill',
  render: (args) => (
    <Stack inline align="start" className="shr-bg-background">
      {([undefined, 'black', 'white', 'brand', 'color'] as const).map((fill) => (
        <SmartHRAILogo {...args} key={fill || 'undefined'} fill={fill} />
      ))}
    </Stack>
  ),
  globals: { backgrounds: { value: 'background' } },
}
