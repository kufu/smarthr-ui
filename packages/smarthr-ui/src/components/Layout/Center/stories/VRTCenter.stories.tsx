import { Meta } from '@storybook/react'

import { Center } from '../../../..'

import { Padding } from './Center.stories'

export default {
  title: 'Layouts（レイアウト）/Center/VRT',
  component: Center,
  render: Padding.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Center>

export const VRT = {}
