import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Center } from '../../..'
import { InformationPanel } from '../../InformationPanel'

import { All } from './Center.stories'

export default {
  title: 'Layouts（レイアウト）/Center',
  component: Center,
  parameters: {
    withTheming: true,
  },
}

export const VRTCenterNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

export const VRTCenterForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTCenterNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}

VRTCenterForcedColors.parameters = {
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
