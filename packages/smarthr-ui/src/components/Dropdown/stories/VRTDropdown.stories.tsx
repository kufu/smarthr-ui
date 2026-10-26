import { type FC, useState } from 'react'
import { userEvent, within } from 'storybook/test'

import { Button } from '../../Button'
import { SingleCombobox } from '../../Combobox'
import { ControlledActionDialog } from '../../Dialog'
import { Dropdown, DropdownContent, DropdownTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

// DropdownContentはrequestAnimationFrame経由でフォーカスを当てるため、
// スナップショット撮影前にその発火を待つ
const waitForAnimationFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

export default {
  title: 'Components/Dropdown/VRT',
  render: (args) => (
    <Dropdown {...args}>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent>ドロップダウンパネル</DropdownContent>
    </Dropdown>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole('button')
    await userEvent.click(button)

    // DropdownContentはrequestAnimationFrame経由でフォーカスを当てるため、
    // スナップショット撮影前にその発火を待つ
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  },
  tags: ['!autodocs'],
} as Meta<typeof Dropdown>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

const _comboboxItems = [
  { label: 'option 1', value: 'value-1' },
  { label: 'option 2', value: 'value-2' },
  { label: 'option 3', value: 'value-3' },
]

export const VRTComboboxInDropdown: StoryObj<typeof Dropdown> = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <SingleCombobox
          name="combobox"
          selectedItem={null}
          onSelect={() => {}}
          onClearClick={() => {}}
          items={_comboboxItems}
        />
        <Button>後続アイテム</Button>
      </DropdownContent>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = await canvas.findByRole('button', { name: 'ドロップダウンボタン' })
    await userEvent.click(trigger)
    await waitForAnimationFrame()

    // HINT: DropdownContentはDropdownのポータル(document.body直下)に描画されるためbodyから参照する
    const body = canvasElement.ownerDocument.body
    const combobox = await within(body).findByRole('combobox')
    await userEvent.click(combobox)
    await userEvent.tab()
    await waitForAnimationFrame()
  },
}

const DialogWithDropdown: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>ダイアログを開く</Button>
      <ControlledActionDialog
        isOpen={isOpen}
        onClickAction={(close) => close()}
        onClickClose={() => setIsOpen(false)}
        heading="ダイアログ"
        actionButton="保存"
      >
        <Dropdown>
          <DropdownTrigger>
            <Button>ドロップダウンボタン</Button>
          </DropdownTrigger>
          <DropdownContent controllable>
            <Button>ドロップダウンアイテム</Button>
          </DropdownContent>
        </Dropdown>
      </ControlledActionDialog>
    </>
  )
}

export const VRTDropdownInDialog: StoryObj<typeof Dropdown> = {
  render: () => <DialogWithDropdown />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dialogTrigger = await canvas.findByRole('button', { name: 'ダイアログを開く' })
    await userEvent.click(dialogTrigger)

    const body = canvasElement.ownerDocument.body
    const dropdownTrigger = await within(body).findByRole('button', {
      name: 'ドロップダウンボタン',
    })
    await userEvent.click(dropdownTrigger)
    await waitForAnimationFrame()

    // Dropdown を開いた状態で Esc キーを押し、Dropdown のみ閉じることを確認する
    await userEvent.keyboard('{Escape}')
    await waitForAnimationFrame()
  },
}

export const VRTNestedDropdown: StoryObj<typeof Dropdown> = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>
        <Button>外側ドロップダウン</Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <Dropdown>
          <DropdownTrigger>
            <Button>内側ドロップダウン</Button>
          </DropdownTrigger>
          <DropdownContent>
            <Button>内側アイテム</Button>
          </DropdownContent>
        </Dropdown>
        <Button>後続アイテム</Button>
      </DropdownContent>
    </Dropdown>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const outerTrigger = await canvas.findByRole('button', { name: '外側ドロップダウン' })
    await userEvent.click(outerTrigger)
    await waitForAnimationFrame()

    // HINT: DropdownContentはDropdownのポータル(document.body直下)に描画されるためbodyから参照する
    const body = canvasElement.ownerDocument.body
    const innerTrigger = await within(body).findByRole('button', { name: '内側ドロップダウン' })
    await userEvent.click(innerTrigger)
    await waitForAnimationFrame()

    // 内側Dropdownのアイテムから続けてTabし、内側トリガーにフォーカスが戻った状態でスナップショットを撮る
    const innerItem = await within(body).findByRole('button', { name: '内側アイテム' })
    innerItem.focus()
    await userEvent.tab()
    await waitForAnimationFrame()
  },
}
