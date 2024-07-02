import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../../InformationPanel'

import { FilterDropdown } from './FilterDropdown'
import { Render } from './FilterDropdown.stories'

const meta = {
  title: 'Buttons（ボタン）/Dropdown',
  component: FilterDropdown,
  parameters: {
    withTheming: true,
  },
} satisfies Meta<typeof FilterDropdown>
export default meta

type Story = StoryObj<typeof meta>

export const VRTOpenFilterDropdownNarrow: Story = {
  name: 'VRT Open FilterDropdown Narrow',
  args: {
    children: null,
    onApply: () => {},
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
      <VRTInformationPanel title="VRT 用の Story です">
        画面幅が狭く、ドロップダウンメニューを開いた状態で表示されます
      </VRTInformationPanel>
      <Render />
    </Wrapper>
  ),
}

export const VRTFilterDropdownForcedColors: Story = {
  name: 'VRT FilterDropdown Forced Colors',
  args: {
    children: null,
    onApply: () => {},
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
      <VRTInformationPanel title="VRT 用の Story です">
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
