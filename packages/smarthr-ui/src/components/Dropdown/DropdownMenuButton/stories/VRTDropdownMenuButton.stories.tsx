import { userEvent, within } from 'storybook/test'

import { AnchorButton, Button } from '../../../Button'
import { SingleCombobox } from '../../../Combobox'
import { RemoteDialogTrigger } from '../../../Dialog'
import { FaGearIcon } from '../../../Icon'
import { Cluster, Stack } from '../../../Layout'
import { Dropdown } from '../../Dropdown'
import { DropdownContent } from '../../DropdownContent'
import { DropdownTrigger } from '../../DropdownTrigger'
import { DropdownMenuButton } from '../DropdownMenuButton'
import { DropdownMenuGroup } from '../DropdownMenuGroup'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

/**
 * $ pict dropdown-menu-button.pict
 * triggerSize onlyIconTrigger triggerIcon
 * s           true            undefined
 * s           false           undefined
 * default     true            undefined
 * s           true            指定あり
 * default     false           undefined
 * default     true            指定あり
 */
const _cases: Array<Pick<ComponentProps<typeof DropdownMenuButton>, 'trigger'>> = [
  { trigger: { children: 'その他の操作', size: 'S', onlyIcon: true } },
  { trigger: { children: 'その他の操作', size: 'S' } },
  { trigger: { children: 'その他の操作', onlyIcon: true } },
  { trigger: { children: 'その他の操作', size: 'S', onlyIcon: { component: FaGearIcon } } },
  { trigger: 'その他の操作' },
  { trigger: { children: 'その他の操作', onlyIcon: { component: FaGearIcon } } },
]

export default {
  title: 'Components/Dropdown/DropdownMenuButton/VRT',
  component: DropdownMenuButton,
  render: (args) => (
    <Cluster align="center" className="shr-h-screen">
      {_cases.map((props, i) => (
        <DropdownMenuButton {...args} {...props} key={i}>
          <DropdownMenuGroup name="グループ1">
            <Button>操作1</Button>
            <Button disabled disabledReason={{ message: '非推奨な理由' }}>
              操作2
            </Button>
            <RemoteDialogTrigger targetId="remote-dialog">
              <Button>操作3</Button>
            </RemoteDialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuGroup name="グループ2">
            <AnchorButton href="#">操作4</AnchorButton>
            <AnchorButton href="#">操作5</AnchorButton>
          </DropdownMenuGroup>
        </DropdownMenuButton>
      ))}
    </Cluster>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, 0: first, [length - 1]: last } = await canvas.findAllByRole('button')
    userEvent.hover(first)
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

const _comboboxItems = [
  { label: 'option 1', value: 'value-1' },
  { label: 'option 2', value: 'value-2' },
  { label: 'option 3', value: 'value-3' },
  { label: 'option 4', value: 'value-4' },
  { label: 'option 5', value: 'value-5' },
]

export const VRTComboboxScrollTracking: StoryObj<typeof DropdownMenuButton> = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button>その他の操作</Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <Stack>
          <Button>操作1</Button>
          <Button>操作2</Button>
          <Button>操作3</Button>
          <Button>操作4</Button>
          <Button>操作5</Button>
          <Button>操作6</Button>
          <Button>操作7</Button>
          <Button>操作8</Button>
          <SingleCombobox
            name="combobox"
            items={_comboboxItems}
            selectedItem={null}
            onSelect={() => {}}
            onClearClick={() => {}}
          />
          <Button>操作9</Button>
          <Button>操作10</Button>
          <Button>操作11</Button>
          <Button>操作12</Button>
          <Button>操作13</Button>
          <Button>操作14</Button>
          <Button>操作15</Button>
          <Button>操作16</Button>
        </Stack>
      </DropdownContent>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const body = canvasElement.ownerDocument.body

    // Dropdown を開く
    const trigger = await within(canvasElement).findByRole('button')
    await userEvent.click(trigger)

    // SingleCombobox のメニューを開く
    const combobox = await within(body).findByRole('combobox')
    await userEvent.click(combobox)

    // Dropdown のコンテンツをスクロールし、Combobox メニューが追従するか確認する
    const dropdownContent = body.querySelector('.smarthr-ui-Dropdown-content')
    if (dropdownContent) {
      dropdownContent.scrollTop += 80
    }
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}
