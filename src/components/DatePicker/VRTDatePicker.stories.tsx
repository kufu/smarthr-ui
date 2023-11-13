import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { DatePicker } from './DatePicker'

export default {
  title: 'Forms（フォーム）/DatePicker',
  component: DatePicker,
  parameters: {
    withTheming: true,
  },
}

const NormalDatePicker = ({ name }: { name: string }) => (
  <List>
    <dt>DatePicker</dt>
    <dd>
      <DatePicker name={name} onChangeDate={action('change')} data-test="datepicker-1" />
    </dd>
  </List>
)

export const VRTExpanded: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      カレンダーを展開した状態で表示されます
    </VRTInformationPanel>
    <NormalDatePicker name="default" />
  </WrapperList>
)
const playExpanded = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textbox = await canvas.findByRole('textbox')
  await textbox.focus()
}
VRTExpanded.play = playExpanded

export const VRTExpandedForcedColors: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <NormalDatePicker name="default" />
  </WrapperList>
)
VRTExpandedForcedColors.play = playExpanded
VRTExpandedForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

export const VRTExpandedYears: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      カレンダーを展開し、年を選択する状態で表示されます
    </VRTInformationPanel>
    <NormalDatePicker name="default" />
  </WrapperList>
)
const playExpandedYears = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textbox = await canvas.findByRole('textbox')
  await textbox.focus()
  const body = canvasElement.ownerDocument.body
  const button = await within(body).findByText('年を選択する')
  await userEvent.click(button)
}
VRTExpandedYears.play = playExpandedYears
export const VRTExpandedYearsForcedColors: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <NormalDatePicker name="default" />
  </WrapperList>
)
VRTExpandedYearsForcedColors.play = playExpandedYears
VRTExpandedYearsForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

export const VRTBottomExpanded: StoryFn = () => (
  <WrapperList>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ページ下部でカレンダーを展開し、上方向に表示されることを確認します
    </VRTInformationPanel>
    <List>
      <dt className="bottom">Place on the page bottom</dt>
      <dd>
        <DatePicker name="place_on_the_page_bottom" onChangeDate={action('change')} />
      </dd>
    </List>
  </WrapperList>
)
VRTBottomExpanded.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textbox = await canvas.findByRole('textbox')
  await textbox.focus()
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

const List = styled.dl`
  padding: 24px;
  margin: 0;
  min-height: 400px;

  dd {
    margin: 10px 0 20px;
  }
  dt.bottom {
    margin-top: 1000px;
  }
`
