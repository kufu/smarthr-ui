import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { SideNav } from './SideNav'
import { All } from './SideNav.stories'

export default {
  title: 'Navigation（ナビゲーション）/SideNav',
  component: SideNav,
  parameters: {
    withTheming: true,
  },
}

export const VRTHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      hoverされた状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTHover.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['li'],
  },
}

export const VRTFocus: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      focusされた状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTFocus.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusVisible: ['button'],
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
