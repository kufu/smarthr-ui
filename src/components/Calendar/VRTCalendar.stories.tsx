import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Calendar } from './Calendar'
import { All } from './Calendar.stories'

export default {
  title: 'Data Display（データ表示）/Calendar',
  component: Calendar,
  parameters: {
    withTheming: true,
  },
}

export const VRTSelectionYear: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      年を選択する状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTSelectionYear.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByText('年を選択する')
  buttons.forEach(async (button) => {
    await userEvent.click(button)
  })
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

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
