import { Center } from '../Center'

import { Padding } from './Center.stories'

import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Components/Layout/Center/VRT',
  component: Center,
  render: Padding.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Center>

export const VRT = {}
