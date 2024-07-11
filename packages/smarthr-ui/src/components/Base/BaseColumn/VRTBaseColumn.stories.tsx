import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../../InformationPanel'

import { BaseColumn } from './BaseColumn'
import { All } from './BaseColumn.stories'

export default {
  title: 'Data Display（データ表示）/BaseColumn',
  component: BaseColumn,
  parameters: {
    withTheming: true,
  },
}

export const VRTBaseForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTBaseForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
