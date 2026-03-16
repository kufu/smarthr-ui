import { Cluster, Stack } from '../../Layout'
import * as Icons from '../FaIcon'
import { LanguageIcon } from '../LanguageIcon'
import { OpenInNewTabIcon } from '../OpenInNewTabIcon'
import { SparklesIcon } from '../SparklesIcon'
import { WarningIcon } from '../WarningIcon'
import { colorSet } from '../generateIcon'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const FaAddressBookIcon = Icons.FaAddressBookIcon

export default {
  title: 'Components/Icon',
  component: FaAddressBookIcon,
  render: (args) => <FaAddressBookIcon {...args} />,
  argTypes: {
    color: {
      options: Object.keys(colorSet),
    },
    alt: { control: 'text' },
  },
  args: {
    color: 'TEXT_BLACK',
    alt: '',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FaAddressBookIcon>

export const All: StoryObj<typeof FaAddressBookIcon> = {
  render: (args) => (
    <Stack gap={0.75} as="ul" className="shr-list-none">
      {[
        ...Object.entries(Icons),
        ['WarningIcon', WarningIcon],
        ['SparklesIcon', SparklesIcon],
        ['LanguageIcon', LanguageIcon],
        ['OpenInNewTabIcon', OpenInNewTabIcon],
      ].map(([name, Icon]) => (
        <li key={name}>
          <Cluster gap={0.5} align="center">
            <Icon {...args} />
            <span>{name}</span>
          </Cluster>
        </li>
      ))}
    </Stack>
  ),
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
