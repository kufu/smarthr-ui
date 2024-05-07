import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel as StoryInformationPanel } from '../InformationPanel'

import { InformationPanel } from './InformationPanel'
import { All } from './InformationPanel.stories'

export default {
  title: 'Data Display（データ表示）/InformationPanel',
  component: InformationPanel,
  parameters: {
    withTheming: true,
  },
}

export const VRTNarrow: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(StoryInformationPanel)`
  margin-bottom: 24px;
`
