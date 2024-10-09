import React from 'react'

import { Cluster, Stack } from '../../Layout'
import * as Icons from '../Icon'
import { colorSet } from '../generateIcon'

import type { Meta, StoryObj } from '@storybook/react'

const FaAddressBookIcon = Icons.FaAddressBookIcon

export default {
  title: 'Media（メディア）/Icon',
  component: FaAddressBookIcon,
  render: (args) => <FaAddressBookIcon {...args} />,
  argTypes: {
    color: {
      options: Object.keys(colorSet),
    },
    alt: { control: 'text' },
    text: { control: 'text' },
  },
  args: {
    color: 'TEXT_BLACK',
    alt: '',
    text: '',
    iconGap: 0.25,
    right: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FaAddressBookIcon>

export const All: StoryObj<typeof FaAddressBookIcon> = {
  render: (args) => (
    <Stack gap={0.75} as="ul" className="shr-list-none">
      {Object.entries(Icons).map(([name, Icon]) => (
        <li key={name}>
          <Icon {...args} text={args.text || name.replace(/Icon$/, '')} />
        </li>
      ))}
    </Stack>
  ),
  args: {
    iconGap: 0.5,
  },
}

export const IconControl: StoryObj<typeof FaAddressBookIcon> = {
  name: 'Playground',
}

export const Color: StoryObj<typeof FaAddressBookIcon> = {
  name: 'color',
  render: (args) => (
    <Cluster>
      <FaAddressBookIcon {...args} color="TEXT_BLACK" />
      <FaAddressBookIcon {...args} color="TEXT_WHITE" />
      <FaAddressBookIcon {...args} color="TEXT_GREY" />
      <FaAddressBookIcon {...args} color="TEXT_DISABLED" />
      <FaAddressBookIcon {...args} color="TEXT_LINK" />
      <FaAddressBookIcon {...args} color="MAIN" />
      <FaAddressBookIcon {...args} color="DANGER" />
      <FaAddressBookIcon {...args} color="WARNING" />
      <FaAddressBookIcon {...args} color="BRAND" />
    </Cluster>
  ),
}

export const Alt: StoryObj<typeof FaAddressBookIcon> = {
  name: 'alt',
  args: {
    alt: '連絡帳',
  },
}

export const Text: StoryObj<typeof FaAddressBookIcon> = {
  name: 'text',
  args: {
    text: '連絡帳',
  },
}

export const IconGap: StoryObj<typeof FaAddressBookIcon> = {
  name: 'iconGap',
  args: {
    text: '連絡帳',
  },
  render: (args) => (
    <Stack>
      <FaAddressBookIcon {...args} iconGap={0.25} />
      <FaAddressBookIcon {...args} iconGap={0.5} />
    </Stack>
  ),
}

export const Right: StoryObj<typeof FaAddressBookIcon> = {
  name: 'right',
  args: {
    text: '連絡帳',
    right: true,
  },
}
