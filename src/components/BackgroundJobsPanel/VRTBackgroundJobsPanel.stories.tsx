import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { BackgroundJobsList } from './BackgroundJobsList'
import { BackgroundJobsPanel } from './BackgroundJobsPanel'
import { PanelView } from './BackgroundJobsPanel.stories'

export default {
  title: 'Data Display（データ表示）/BackgroundJobsPanel',
  component: BackgroundJobsPanel,
  subcomponents: {
    BackgroundJobsList,
  },
  parameters: {
    withTheming: true,
  },
}

export const VRTPanelForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <PanelView />
  </>
)
VRTPanelForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
