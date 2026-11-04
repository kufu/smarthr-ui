import { useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { Stack } from '../../Layout'
import { DropdownCloser } from '../DropdownCloser'
import { Dropdown, DropdownContent, DropdownTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

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

export const ContentHeightIncreasesAfterOpen: StoryObj<typeof Dropdown> = {
  name: '開いた後にコンテンツの高さが変化しても画面内に収まりスクロールできること',
  render: (args) => {
    const [itemCount, setItemCount] = useState(1)

    return (
      <Dropdown {...args}>
        <DropdownTrigger>
          <Button>ドロップダウンボタン</Button>
        </DropdownTrigger>
        <DropdownContent controllable>
          <Stack>
            <Button onClick={() => setItemCount((count) => count + 10)}>項目を10件追加する</Button>
            {Array.from({ length: itemCount }, (_, i) => (
              <p key={i}>項目 {i + 1}</p>
            ))}
          </Stack>
        </DropdownContent>
      </Dropdown>
    )
  },
}
