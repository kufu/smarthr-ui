import React from 'react'

import { Cluster, Stack } from '../../Layout'
import { Text } from '../../Text'
import { Badge } from '../Badge'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/Badge',
  component: Badge,
  render: (args) => <Badge {...args} />,
  args: {
    count: 0,
    overflowCount: 99,
    showZero: true,
    type: 'blue',
    dot: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Badge>

export const BadgeControl: StoryObj<typeof Badge> = {
  name: 'Playground',
  args: {},
}

export const Count: StoryObj<typeof Badge> = {
  name: 'count',
  render: (args) => (
    <Cluster>
      {new Array(10).fill(0).map((_, i) => (
        <Badge {...args} count={i + 1} key={i} />
      ))}
    </Cluster>
  ),
  args: {},
}

export const OverflowCount: StoryObj<typeof Badge> = {
  name: 'overflowCount',
  render: (args) => (
    <Cluster>
      <Badge {...args} count={98} />
      <Badge {...args} count={99} />
      <Badge {...args} count={100} />
    </Cluster>
  ),
  args: {
    overflowCount: 99,
  },
}

export const ShowZero: StoryObj<typeof Badge> = {
  name: 'showZero',
  render: (args) => (
    <Stack>
      <Cluster>
        <Text>true</Text>
        <Badge {...args} showZero={true} count={0} />
      </Cluster>
      <Cluster>
        <Text>false</Text>
        <Badge {...args} showZero={false} count={0} />
      </Cluster>
    </Stack>
  ),
  args: {
    showZero: true,
  },
}

export const Type: StoryObj<typeof Badge> = {
  name: 'type',
  render: (args) => (
    <Cluster>
      <Badge {...args} type="blue" />
      <Badge {...args} type="yellow" />
      <Badge {...args} type="red" />
      <Badge {...args} type="grey" />
    </Cluster>
  ),
  args: {},
}

export const Dot: StoryObj<typeof Badge> = {
  name: 'dot',
  render: (args) => <Badge {...args} dot={true} />,
  args: {},
}
