import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'

import { InformationPanel } from '../InformationPanel'
import { Stack } from '../Layout'

import { SingleCombobox as StoriesSingleComboBox } from './SingleCombobox.stories'

import { SingleComboBox } from '.'

export default {
  title: 'Forms（フォーム）/SingleComboBox',
  component: SingleComboBox,
  parameters: {
    withTheming: true,
  },
}

export const VRTSingleCombobox: StoryFn = () => (
  <Stack>
    <InformationPanel title="VRT 用の Story です">
      Singleコンボボックスのリストを展開して1つ目の項目をホバーした状態で表示されます
    </InformationPanel>
    {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
    <StoriesSingleComboBox />
  </Stack>
)
const playSingle = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textboxes = await canvas.findAllByRole('combobox')
  await textboxes[0].focus()
  const body = canvasElement.ownerDocument.body
  const option = await within(body).findByText('option 1')
  await userEvent.hover(option)
  const helpMessage = await within(body).findAllByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage[0]) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}
VRTSingleCombobox.play = playSingle

export const VRTForcedColorsSingleCombobox: StoryFn = () => (
  <Stack>
    <InformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます{' '}
    </InformationPanel>
    {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
    <StoriesSingleComboBox />
  </Stack>
)
VRTForcedColorsSingleCombobox.play = playSingle
VRTForcedColorsSingleCombobox.parameters = {
  chromatic: { forcedColors: 'active' },
}
