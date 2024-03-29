import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Header } from './Header'
import { All } from './Header.stories'

export default {
  title: 'Navigation（ナビゲーション）/Header',
  component: Header,
  parameters: {
    withTheming: true,
  },
}

export const VRTFocusVisible: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      通常のボタンがfocusされた状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTFocusVisible.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusVisible: ['a', 'button'],
  },
}

export const VRTDropDown: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ドロップダウンを表示した状態で表示されます
    </VRTInformationPanel>
    <WrapperForDropdown>
      <All />
    </WrapperForDropdown>
  </>
)
VRTDropDown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: /株式会社SmartHR/ })
  await userEvent.click(button)
}

export const VRTLauncher: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ランチャーを表示した状態で表示されます
    </VRTInformationPanel>
    <WrapperForLauncher>
      <All />
    </WrapperForLauncher>
  </>
)
VRTLauncher.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: /アプリ/ })
  await userEvent.click(button)
}

export const VRTNarrowTablet: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      タブレットの画面幅で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTNarrowTablet.parameters = {
  viewport: {
    defaultViewport: 'vrtTablet',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtTablet' },
    },
  },
}

export const VRTNarrowMobile: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      モバイルの画面幅で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTNarrowMobile.parameters = {
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
    <WrapperForLauncher>
      <All />
    </WrapperForLauncher>
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTForcedColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: /アプリ/ })
  await userEvent.click(button)
}

const VRTInformationPanel = styled(InformationPanel)`
  margin: 1rem 1rem 24px;
`
const WrapperForDropdown = styled.div`
  margin-bottom: 80px;
`
const WrapperForLauncher = styled.div`
  padding-bottom: 400px;
`
