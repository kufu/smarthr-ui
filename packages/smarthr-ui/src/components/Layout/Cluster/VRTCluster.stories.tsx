import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Cluster } from '../../..'
import { InformationPanel } from '../../InformationPanel'

import { All } from './Cluster.stories'

export default {
  title: 'Layouts（レイアウト）/Cluster',
  component: Cluster,
  parameters: {
    withTheming: true,
  },
}

export const VRTClusterNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

export const VRTClusterForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTClusterNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}

VRTClusterForcedColors.parameters = {
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
