import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React, { useState } from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Calendar } from './Calendar'
import { All } from './Calendar.stories'

export default {
  title: 'Data Display（データ表示）/Calendar',
  component: Calendar,
  parameters: {
    withTheming: true,
  },
}

export const VRTFocus: StoryFn = () => {
  const [value, setValue] = useState(new Date(2020, 0, 1))
  return (
    <>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        各ボタンにフォーカスを当てた状態で表示されます
      </VRTInformationPanel>
      <Calendar
        onSelectDate={(e, date) => {
          action('selected')(e, date)
          setValue(date)
        }}
        value={value}
      />
    </>
  )
}
VRTFocus.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusVisible: ['header button', 'tr:first-child td:nth-child(4) button'],
  },
}

export const VRTSelectionYear: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      年を選択する状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTSelectionYear.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByText('年を選択する')
  buttons.forEach(async (button) => {
    await userEvent.click(button)
  })
}

export const VRTFocusSelectionYear: StoryFn = () => {
  const [value, setValue] = useState(new Date(2020, 0, 1))
  return (
    <>
      <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
        年選択で特定の年にフォーカスを当てた状態で表示されます
      </VRTInformationPanel>
      <Calendar
        onSelectDate={(e, date) => {
          action('selected')(e, date)
          setValue(date)
        }}
        value={value}
      />
    </>
  )
}
VRTFocusSelectionYear.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = await canvas.findByText('年を選択する')
  await userEvent.click(button)
  const body = canvasElement.ownerDocument.body
  const yearButton = await within(body).findByRole('button', { name: '2020' })
  await yearButton.focus()
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
  margin-bottom: 24px;
`
