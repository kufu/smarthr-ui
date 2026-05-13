import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownTrigger,
    DropdownContent,
    DropdownCloser,
  },
  render: (args) => (
    <Dropdown {...args}>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent>ドロップダウンパネル</DropdownContent>
    </Dropdown>
  ),
  args: {
    onOpen: action('onOpen'),
    onClose: action('onClose'),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Dropdown>

export const DropdownControl: StoryObj<typeof Dropdown> = {
  name: 'Playground',
  args: {},
}
