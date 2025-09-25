import { Cluster, Stack } from '../../Layout'
import * as Icons from '../Icon'
import { colorSet } from '../generateIcon'

import type { Meta, StoryObj } from '@storybook/react'

const FaAddressBookIcon = Icons.FaAddressBookIcon

export default {
  title: 'Components/Icon',
  component: FaAddressBookIcon,
  render: (args) => <FaAddressBookIcon aria-hidden={true} {...args} />,
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
      <FaAddressBookIcon aria-hidden={true} {...args} color="TEXT_BLACK" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="TEXT_WHITE" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="TEXT_GREY" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="TEXT_DISABLED" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="TEXT_LINK" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="MAIN" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="DANGER" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="WARNING" />
      <FaAddressBookIcon aria-hidden={true} {...args} color="BRAND" />
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
      <FaAddressBookIcon aria-hidden={true} {...args} iconGap={0.25} />
      <FaAddressBookIcon aria-hidden={true} {...args} iconGap={0.5} />
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
