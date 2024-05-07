import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Textarea } from './Textarea'
import { All } from './Textarea.stories'

export default {
  title: 'Forms（フォーム）/Textarea',
  component: Textarea,
  parameters: {
    withTheming: true,
  },
}

export const VRTFocus: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      focus した状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTFocus.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusVisible: ['textarea'],
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
