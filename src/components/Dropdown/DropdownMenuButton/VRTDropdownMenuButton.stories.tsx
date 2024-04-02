import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../../InformationPanel'

import { DropdownMenuButton } from './DropdownMenuButton'
import { Render } from './DropdownMenuButton.stories'

const meta = {
  title: 'Buttons（ボタン）/Dropdown',
  component: DropdownMenuButton,
  parameters: {
    withTheming: true,
  },
} satisfies Meta<typeof DropdownMenuButton>
export default meta

type Story = StoryObj<typeof meta>

export const VRTOpenDropdownMenuButtonNarrow: Story = {
  name: 'VRT Open DropdownMenuButton Narrow',
  args: {
    label: '',
    children: null,
  },
  parameters: {
    viewport: {
      defaultViewport: 'vrtMobile',
    },
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = await canvas.findAllByRole('button')
    userEvent.click(buttons[0])
  },
  render: () => (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        画面幅が狭く、ドロップダウンメニューを開いた状態で表示されます
      </VRTInformationPanel>
      <Render />
    </Wrapper>
  ),
}

export const VRTDropdownMenuButtonForcedColors: Story = {
  name: 'VRT DropdownMenuButton Forced Colors',
  args: {
    label: '',
    children: null,
  },
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = await canvas.findAllByRole('button')
    userEvent.click(buttons[0])
  },
  render: () => (
    <Wrapper>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        Chromatic 上では強制カラーモードで表示されます
      </VRTInformationPanel>
      <Render />
    </Wrapper>
  ),
}

const Wrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
`

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
