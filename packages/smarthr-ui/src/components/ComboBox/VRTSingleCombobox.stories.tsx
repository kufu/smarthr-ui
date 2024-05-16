import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

// eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation, smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control
import { SingleCombobox as Single } from './SingleCombobox.stories'

import { SingleComboBox } from '.'

export default {
  title: 'Forms（フォーム）/SingleComboBox',
  component: SingleComboBox,
  parameters: {
    withTheming: true,
  },
}

export const VRTSingleCombobox: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Singleコンボボックスのリストを展開して1つ目の項目をホバーした状態で表示されます
    </VRTInformationPanel>
    <Single />
  </WrapperList>
)
const playSingle = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textboxes = await canvas.findAllByRole('combobox')
  await textboxes[0].focus()
  const body = canvasElement.ownerDocument.body
  const option = await within(body).findByText('option 1')
  await userEvent.hover(option)
}
VRTSingleCombobox.play = playSingle

export const VRTSingleComboboxForcedColors: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます{' '}
    </VRTInformationPanel>
    <Single />
  </WrapperList>
)
VRTSingleComboboxForcedColors.play = playSingle
VRTSingleComboboxForcedColors.parameters = {
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
