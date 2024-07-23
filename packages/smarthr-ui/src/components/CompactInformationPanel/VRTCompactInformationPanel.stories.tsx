import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Type } from './CompactInformationPanel.stories'

import { CompactInformationPanel } from '.'

export default {
  title: 'Data Display（データ表示）/CompactInformationPanel（非推奨）',
  component: CompactInformationPanel,
  parameters: {
    withTheming: true,
  },
}

export const VRTNarrow: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <Type />
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
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <Type />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
