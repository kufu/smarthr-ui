import { StoryFn } from '@storybook/react'
import { within } from '@storybook/testing-library'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { BottomFixedArea } from './BottomFixedArea'
import { _BottomFixedArea as All } from './BottomFixedArea.stories'

export default {
  title: 'Navigation（ナビゲーション）/BottomFixedArea',
  component: BottomFixedArea,
  parameters: {
    withTheming: true,
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
  },
}

export const VRTHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
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
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
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

export const VRTFocusVisibleAnchor: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      アンカー風のボタンの1つ目がfocusされた状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTFocusVisibleAnchor.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: 'Tertiary_1' })
  await button.focus()
}

export const VRTNarrow: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭い状態で表示されます
    </VRTInformationPanel>
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
  margin: 1rem 1rem 24px;
`
