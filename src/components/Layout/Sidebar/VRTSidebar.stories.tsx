import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Sidebar } from '../../..'
import { InformationPanel } from '../../InformationPanel'

import { All } from './Sidebar.stories'

export default {
  title: 'Layouts（レイアウト）/Sidebar',
  component: Sidebar,
  parameters: {
    withTheming: true,
  },
}

export const VRTSidebarNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

export const VRTSidebarForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTSidebarNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}

VRTSidebarForcedColors.parameters = {
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
