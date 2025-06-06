import { Meta } from '@storybook/react'

import { Cluster } from '../../../..'

import { Gap } from './Cluster.stories'

export default {
  title: 'Components/Cluster/VRT',
  component: Cluster,
  render: Gap.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Cluster>

export const VRT = {}
