import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import styled, { css } from 'styled-components'

import { InformationPanel } from '../InformationPanel'
import { Stack } from '../Layout'

import { AppNavi } from './AppNavi'
import { Default } from './AppNavi.stories'

export default {
  title: 'Navigation（ナビゲーション）/AppNavi',
  component: AppNavi,
  parameters: {
    withTheming: true,
  },
}

export const VRTHover: StoryFn = () => (
  <WrapperStack>
    <InformationPanel title="VRT 用の Story です">hoverした状態で表示されます</InformationPanel>
    <Default />
  </WrapperStack>
)
VRTHover.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['button, a'],
  },
}

export const VRTFocusButton: StoryFn = () => (
  <WrapperStack>
    <InformationPanel title="VRT 用の Story です">
      ボタンをフォーカスした状態で表示されます
    </InformationPanel>
    <Default />
  </WrapperStack>
)
VRTFocusButton.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: 'カレントボタン' })
  button.focus()
}

export const VRTFocusAnchor: StoryFn = () => (
  <WrapperStack>
    <InformationPanel title="VRT 用の Story です">
      アンカーをフォーカスした状態で表示されます
    </InformationPanel>
    <Default />
  </WrapperStack>
)
VRTFocusAnchor.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const anchor = await canvas.getByRole('link')
  anchor.focus()
}

export const VRTDropDown: StoryFn = () => (
  <WrapperStack>
    <InformationPanel title="VRT 用の Story です">
      ドロップダウンを表示した状態で表示されます
    </InformationPanel>
    <Default />
  </WrapperStack>
)
VRTDropDown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: '設定' })
  await userEvent.click(button)
}

export const VRTForcedColors: StoryFn = () => (
  <WrapperStack>
    <InformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </InformationPanel>
    <Default />
  </WrapperStack>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTForcedColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByRole('button', { name: '設定' })
  await userEvent.click(button)
}

const WrapperStack = styled(Stack)`
  ${({ theme: { color, space } }) => css`
    padding-block-end: ${space(8)};
    background-color: ${color.BACKGROUND};
  `}
`
