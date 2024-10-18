import React from 'react'

import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/Dropdown/DropdownCloser',
  component: DropdownCloser,
  render: (args) => (
    <Dropdown>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <p>
          <code>DropdownContent</code> が <code>controllable</code>{' '}
          の時に、パネルを閉じるためのコンポーネントです。
        </p>
        <DropdownCloser {...args}>
          <Button>閉じる</Button>
        </DropdownCloser>
      </DropdownContent>
    </Dropdown>
  ),
  args: {
    controllable: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownCloser>

export const DropdownCloserControl: StoryObj<typeof DropdownCloser> = {
  name: 'Playground',
  args: {},
}
