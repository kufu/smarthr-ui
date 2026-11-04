import { Fragment } from 'react'

import { Button } from '../../../Button'
import { Chip } from '../../../Chip'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { Cluster, Stack } from '../../../Layout'
import { Tuck } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Experimental/Tuck',
  component: Tuck,
  render: (args) => (
    // eslint-disable-next-line smarthr/best-practice-for-layouts -- Tuck は子要素を複数のアイテムとして Cluster に並べるため
    <Cluster align="center">
      <Tuck {...args}>
        {[...Array(20)].map((_, i) => (
          <Chip key={i}>ラベル{i + 1}</Chip>
        ))}
      </Tuck>
    </Cluster>
  ),
  args: {
    tucked: {
      renderer: (items) => <Chip color="blue">+{items.length}</Chip>,
    },
  },
  argTypes: {
    tucked: { control: false },
    maxLines: { control: { type: 'number', min: 1 } },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Tuck>

export default meta

export const Playground: StoryObj<typeof Tuck> = {}

export const TuckedRenderer: StoryObj<typeof Tuck> = {
  name: 'tucked.renderer',
  args: {
    tucked: {
      renderer: (items) => (
        <Dropdown>
          <DropdownTrigger>
            <Button size="S">他{items.length}件</Button>
          </DropdownTrigger>
          <DropdownContent>
            <Cluster className="shr-p-1">{items}</Cluster>
          </DropdownContent>
        </Dropdown>
      ),
    },
  },
}

export const MaxLines: StoryObj<typeof Tuck> = {
  name: 'maxLines',
  render: (args) => (
    <Stack>
      {[1, 2, 3].map((maxLines) => (
        <Fragment key={maxLines}>{meta.render({ ...args, maxLines })}</Fragment>
      ))}
    </Stack>
  ),
}

export const TuckedScope: StoryObj<typeof Tuck> = {
  name: 'tucked.scope',
  render: (args) => (
    <Stack>
      {(['overflowed', 'all'] as const).map((scope) => (
        <Fragment key={scope}>
          {meta.render({ ...args, tucked: { ...args.tucked, scope } })}
        </Fragment>
      ))}
    </Stack>
  ),
}
