import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Dropdown } from './Dropdown'
import { All, ControllableDropdown } from './Dropdown.stories'
import { DropdownCloser } from './DropdownCloser'
import { DropdownContent } from './DropdownContent'
import { DropdownScrollArea } from './DropdownScrollArea'
import { DropdownTrigger } from './DropdownTrigger'

export default {
  title: 'Buttons（ボタン）/Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownTrigger,
    DropdownContent,
    DropdownCloser,
    DropdownScrollArea,
  },
  parameters: {
    withTheming: true,
  },
}

export const VRTOpenDropdownNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭く、入れ子を開いた状態で表示されます
    </VRTInformationPanel>
    <ControllableDropdown />
  </Wrapper>
)

export const VRTOpenNested: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      入れ子を開いた状態で表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

export const VRTDropdownForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTOpenNested.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button1 = await canvas.findByText('入れ子にできる Dropdown')
  await userEvent.click(button1)
  const body = canvasElement.ownerDocument.body
  const button2 = await within(body).findByText('さらに入れ子にできる Dropdown')
  await userEvent.click(button2)
  const button3 = await within(body).findByText('いくらでも入れ子にできる Dropdown')
  await userEvent.click(button3)
}

VRTOpenDropdownNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}
VRTOpenDropdownNarrow.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

VRTDropdownForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTDropdownForcedColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
`

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
