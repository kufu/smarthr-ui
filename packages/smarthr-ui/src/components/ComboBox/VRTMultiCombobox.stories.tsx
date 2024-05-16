import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

// eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation, smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control
import { MultiCombobox as Multi } from './MultiCombobox.stories'

import { MultiComboBox } from '.'

export default {
  title: 'Forms（フォーム）/MultiComboBox',
  component: MultiComboBox,
  parameters: {
    withTheming: true,
  },
}

export const VRTMultiCombobox: StoryFn = () => (
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
VRTMultiCombobox.play = playMulti

export const VRTMultiComboboxForcedColors: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます{' '}
    </VRTInformationPanel>
    <Multi />
  </WrapperList>
)
VRTMultiComboboxForcedColors.play = playMulti
VRTMultiComboboxForcedColors.parameters = {
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
