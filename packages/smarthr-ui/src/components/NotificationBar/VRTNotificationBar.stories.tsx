import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { NotificationBar } from './NotificationBar'
import { All, Demo } from './NotificationBar.stories'

export default {
  title: 'States（状態）/NotificationBar',
  component: NotificationBar,
  parameters: {
    withTheming: true,
  },
}

export const VRTNotificationBarNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

export const VRTNotificationBarShow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      NotificationBarを表示した状態で表示されます
    </VRTInformationPanel>
    <Demo />
  </Wrapper>
)

export const VRTNotificationBarFocus: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      それぞれ1番目のNotificationBarの閉じるボタンにフォーカスした状態で表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

export const VRTNotificationBarForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTNotificationBarShow.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  await userEvent.click(buttons[0])
}

VRTNotificationBarNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}

VRTNotificationBarShow.parameters = {
  chromatic: { pauseAnimationAtEnd: true },
}

VRTNotificationBarFocus.parameters = {
  pseudo: {
    focusVisible: ['dd > div:first-child .smarthr-ui-NotificationBar-closeButton'],
  },
}

VRTNotificationBarForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
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
