import { action } from '@storybook/addon-actions'
import React from 'react'

import { AnchorButton, Button } from '../../../Button'
import { RemoteDialogTrigger } from '../../../Dialog'
import { FaGearIcon } from '../../../Icon'
import { DropdownMenuButton } from '../DropdownMenuButton'
import { DropdownMenuGroup } from '../DropdownMenuGroup'

import type { Meta, StoryObj } from '@storybook/react'

const _sampleTriggerIcons = {
  undefined,
  'FaGearIcon（onlyIconTrigger の時のみ動作）': FaGearIcon,
}

export default {
  title: 'Buttons（ボタン）/DropdownMenuButton',
  component: DropdownMenuButton,
  subcomponents: { DropdownMenuGroup },
  render: (args) => (
    <DropdownMenuButton {...args}>
      <Button>操作1</Button>
      <AnchorButton href="#">操作2</AnchorButton>
      <RemoteDialogTrigger targetId="remoteDialog" onClick={action('open-remote-dialog')}>
        <Button>操作3</Button>
      </RemoteDialogTrigger>
    </DropdownMenuButton>
  ),
  argTypes: {
    triggerIcon: {
      control: 'radio',
      options: Object.keys(_sampleTriggerIcons),
      mapping: _sampleTriggerIcons,
    },
  },
  args: {
    label: 'その他の操作',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownMenuButton>

export const Playground: StoryObj<typeof DropdownMenuButton> = {
  args: {
    triggerSize: 'default',
    onlyIconTrigger: false,
  },
}

export const Label: StoryObj<typeof DropdownMenuButton> = {
  name: 'label',
  args: {
    label: 'ドロップダウンメニューボタンラベル',
  },
}

export const TriggerSize: StoryObj<typeof DropdownMenuButton> = {
  name: 'triggerSize',
  args: {
    triggerSize: 's',
  },
}

export const OnlyIconTrigger: StoryObj<typeof DropdownMenuButton> = {
  name: 'onlyIconTrigger',
  args: {
    onlyIconTrigger: true,
  },
}

export const TriggerIcon: StoryObj<typeof DropdownMenuButton> = {
  name: 'triggerIcon',
  args: {
    // onlyIconTrigger が false の時は、開閉を示唆する FaCaretDownIcon が表示されます
    onlyIconTrigger: true,
    triggerIcon: FaGearIcon,
  },
}
