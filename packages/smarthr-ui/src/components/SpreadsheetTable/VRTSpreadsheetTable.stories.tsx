import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { SpreadsheetTable } from './SpreadsheetTable'
import { All } from './SpreadsheetTable.stories'

export default {
  title: 'Data Display（データ表示）/SpreadsheetTable',
  component: SpreadsheetTable,
  parameters: {
    withTheming: true,
  },
}

export const VRTMobile: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTMobile.parameters = {
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
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
