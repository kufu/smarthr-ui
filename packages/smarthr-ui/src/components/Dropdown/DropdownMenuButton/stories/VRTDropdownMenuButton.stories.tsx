import { userEvent, within } from '@storybook/test'
import React, { ComponentProps } from 'react'

import { AnchorButton, Button } from '../../../Button'
import { RemoteDialogTrigger } from '../../../Dialog'
import { FaGearIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { DropdownMenuButton } from '../DropdownMenuButton'
import { DropdownMenuGroup } from '../DropdownMenuGroup'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * $ pict dropdown-menu-button.pict
 * triggerSize onlyIconTrigger triggerIcon
 * s           true            udnefined
 * s           false           udnefined
 * default     true            udnefined
 * s           true            指定あり
 * default     false           udnefined
 * default     true            指定あり
 */
const _cases: Array<
  Pick<ComponentProps<typeof DropdownMenuButton>, 'triggerSize' | 'onlyIconTrigger' | 'triggerIcon'>
> = [
  { triggerSize: 's', onlyIconTrigger: true, triggerIcon: undefined },
  { triggerSize: 's', onlyIconTrigger: false, triggerIcon: undefined },
  { triggerSize: 'default', onlyIconTrigger: true, triggerIcon: undefined },
  { triggerSize: 's', onlyIconTrigger: true, triggerIcon: FaGearIcon },
  { triggerSize: 'default', onlyIconTrigger: false, triggerIcon: undefined },
  { triggerSize: 'default', onlyIconTrigger: true, triggerIcon: FaGearIcon },
]

export default {
  title: 'Buttons（ボタン）/DropdownMenuButton/VRT',
  component: DropdownMenuButton,
  render: (args) => (
    <Cluster align="center" className="shr-h-screen">
      {_cases.map((props, i) => (
        <DropdownMenuButton {...args} {...props} key={i}>
          <DropdownMenuGroup name="グループ1">
            <Button>操作1</Button>
            <Button disabled disabledDetail={{ message: '非推奨な理由' }}>
              操作2
            </Button>
          </DropdownMenuGroup>
          <RemoteDialogTrigger targetId="remote-dialog">
            <Button>操作3</Button>
          </RemoteDialogTrigger>
          <DropdownMenuGroup name="グループ2">
            <AnchorButton href="#">操作4</AnchorButton>
            <AnchorButton href="#">操作5</AnchorButton>
          </DropdownMenuGroup>
        </DropdownMenuButton>
      ))}
    </Cluster>
  ),
  args: {
    label: 'その他の操作',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = await canvas.findAllByRole('button')
    userEvent.click(last)
  },
  tags: ['!autodocs'],
} as Meta<typeof DropdownMenuButton>

export const VRT: StoryObj<typeof DropdownMenuButton> = {}

export const VRTForcedColors: StoryObj<typeof DropdownMenuButton> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
