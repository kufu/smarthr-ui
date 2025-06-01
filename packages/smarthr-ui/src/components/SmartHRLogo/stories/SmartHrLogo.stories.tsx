import { backgroundColor } from '../../../themes'
import { Stack } from '../../Layout'
import { SmartHRLogo } from '../SmartHRLogo'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Media（メディア）/SmartHRLogo',
  component: SmartHRLogo,
  render: (args) => <SmartHRLogo {...args} />,
  args: {},
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.brand }],
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SmartHRLogo>

export const Playground: StoryObj<typeof SmartHRLogo> = {}

export const Alt: StoryObj<typeof SmartHRLogo> = {
  name: 'alt',
  args: {
    alt: 'SmartHR（スマートHR）ロゴ',
  },
}

export const Width: StoryObj<typeof SmartHRLogo> = {
  name: 'width',
  args: {
    width: '20em',
  },
}

export const Height: StoryObj<typeof SmartHRLogo> = {
  name: 'height',
  args: {
    height: '2em',
  },
}

export const Fill: StoryObj<typeof SmartHRLogo> = {
  name: 'fill',
  render: (args) => (
    <Stack className="shr-bg-background" inline>
      {[undefined, 'white', 'brand', 'black'].map((fill) => (
        <SmartHRLogo {...args} fill={fill as any} />
      ))}
    </Stack>
  ),
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.background }],
    },
  },
}
