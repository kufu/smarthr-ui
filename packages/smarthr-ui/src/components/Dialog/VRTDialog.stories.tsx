import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Default } from './Dialog.stories'

import {
  ActionDialog,
  ActionDialogContent,
  Dialog,
  DialogCloser,
  DialogContent,
  DialogTrigger,
  DialogWrapper,
  MessageDialog,
  MessageDialogContent,
  ModelessDialog,
} from '.'

export default {
  title: 'Dialog（ダイアログ）/Dialog',
  component: Dialog,
  subcomponents: {
    DialogContent,
    DialogWrapper,
    DialogTrigger,
    DialogCloser,
    MessageDialog,
    MessageDialogContent,
    ActionDialog,
    ActionDialogContent,
    ModelessDialog,
  },
  parameters: {
    withTheming: true,
  },
}
export const VRTOpenDialogNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      画面幅が狭く、ダイアログを開いた状態で表示されます
    </VRTInformationPanel>
    <Default />
  </Wrapper>
)

export const VRTDialogForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <Default />
  </Wrapper>
)

VRTOpenDialogNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}
VRTOpenDialogNarrow.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

VRTDialogForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTDialogForcedColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
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
