import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { FloatArea } from './FloatArea'
import { All } from './FloatArea.stories'

export default {
  title: 'Navigation（ナビゲーション）/FloatArea',
  component: FloatArea,
  parameters: {
    withTheming: true,
  },
}

export const VRTHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      通常のボタン、アンカー風のボタンすべてがhoverされた状態で表示されます
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

export const VRTFocusVisibleButton: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      通常のボタンがfocusされた状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTFocusVisibleButton.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusVisible: ['button'],
  },
}

export const VRTNarrow: StoryFn = () => (
  <>
    <VRTNarrowInformationPanel title="VRT 用の Story です">
      画面幅が狭い状態で表示されます
    </VRTNarrowInformationPanel>
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
  margin: 8rem 0 24px;
`
const VRTNarrowInformationPanel = styled(InformationPanel)`
  margin: 14rem 0 24px;
`
