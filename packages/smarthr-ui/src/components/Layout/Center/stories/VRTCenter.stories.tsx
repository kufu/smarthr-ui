
import { Center } from '../../../..'

import { Padding } from './Center.stories'

import type { Meta } from '@storybook/react-webpack5'

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
