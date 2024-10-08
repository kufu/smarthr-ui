import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'

import { InformationPanel } from '../InformationPanel'
import { Stack } from '../Layout'

import { MultiCombobox as StoriesMultiComboBox } from './MultiCombobox.stories'

import { MultiComboBox } from '.'

export default {
  title: 'Forms（フォーム）/MultiComboBox',
  component: MultiComboBox,
  parameters: {
    withTheming: true,
  },
}

export const VRTMultiCombobox: StoryFn = () => (
  <Stack>
    <InformationPanel title="VRT 用の Story です">
      Multiコンボボックスのリストを展開して1つ目と2つ目の項目を選択した状態で表示されます
    </InformationPanel>
    {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
    <StoriesMultiComboBox />
  </Stack>
)

const waitForRAF = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve()
    })
  })
const playMulti = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const comboboxes = await canvas.findAllByRole('combobox')
  comboboxes[0].focus()
  const body = canvasElement.ownerDocument.body
  const option1 = await within(body).findByText('option 1')
  await userEvent.click(option1)
  await waitForRAF()
  const option2 = await within(body).findByText('option 2')
  await userEvent.click(option2)
  await waitForRAF()
  const helpMessage = await within(body).findAllByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage[0]) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}
VRTMultiCombobox.play = playMulti

export const VRTForcedColorsMultiCombobox: StoryFn = () => (
  <Stack>
    <InformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます{' '}
    </InformationPanel>
    {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
    <StoriesMultiComboBox />
  </Stack>
)
VRTForcedColorsMultiCombobox.play = playMulti
VRTForcedColorsMultiCombobox.parameters = {
  chromatic: { forcedColors: 'active' },
}
