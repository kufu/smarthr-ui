import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { RightFixedNote } from './RightFixedNote'
import { All } from './RightFixedNote.stories'

export default {
  title: 'Data Display（データ表示）/RightFixedNote',
  component: RightFixedNote,
  parameters: {
    withTheming: true,
  },
}

export const VRTHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hoverの状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTHover.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['button'],
  },
}

export const VRTFocusVisible: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      focusの状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTFocusVisible.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusVisible: ['button', 'textarea'],
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

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
