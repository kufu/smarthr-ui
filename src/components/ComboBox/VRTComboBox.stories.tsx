import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Multi, Single } from './ComboBox.stories'

import { MultiComboBox, SingleComboBox } from '.'

export default {
  title: 'Forms（フォーム）/ComboBox',
  component: SingleComboBox,
  subcomponents: { MultiComboBox },
  parameters: {
    withTheming: true,
  },
}

export const VRTSingle: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Singleコンボボックスのリストを展開して1つ目の項目をホバーした状態で表示されます
    </VRTInformationPanel>
    <Single />
  </WrapperList>
)
const playSingle = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textboxes = await canvas.findAllByRole('textbox')
  await textboxes[0].focus()
  const body = canvasElement.ownerDocument.body
  const option = await within(body).findByText('option 1')
  await userEvent.hover(option)
}
VRTSingle.play = playSingle

export const VRTMulti: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Multiコンボボックスのリストを展開して1つ目と2つ目の項目を選択した状態で表示されます
    </VRTInformationPanel>
    <Multi />
  </WrapperList>
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
}
VRTMulti.play = playMulti

export const VRTSingleForcedColors: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます{' '}
    </VRTInformationPanel>
    <Single />
  </WrapperList>
)
VRTSingleForcedColors.play = playSingle
VRTSingleForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

export const VRTMultiForcedColors: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます{' '}
    </VRTInformationPanel>
    <Multi />
  </WrapperList>
)
VRTMultiForcedColors.play = playMulti
VRTMultiForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const WrapperList = styled.ul`
  padding: 0 24px;
  list-style: none;
  & > li {
    padding: 16px;
    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
