import { StoryFn } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Tooltip } from './Tooltip'
import { RegHover } from './Tooltip.stories'

export default {
  title: 'Data Display（データ表示）/Tooltip',
  component: Tooltip,
  parameters: {
    withTheming: true,
  },
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <RegHover />
  </>
)

VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTForcedColors.play = ({ canvasElement }) => {
  const tooltips = canvasElement.querySelectorAll('.smarthr-ui-Tooltip')
  tooltips.forEach((tooltip) => userEvent.hover(tooltip))
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
