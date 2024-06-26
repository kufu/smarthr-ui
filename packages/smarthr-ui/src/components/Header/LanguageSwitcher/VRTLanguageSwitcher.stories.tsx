import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'

import { InformationPanel } from '../../InformationPanel'
import { Stack } from '../../Layout'

import { All } from './LanguageSwitcher.stories'

import { LanguageSwitcher } from '.'

export default {
  title: 'Navigation（ナビゲーション）/Header/LanguageSwitcher',
  component: LanguageSwitcher,
}

export const VRTDropDown: StoryFn = () => (
  <Stack>
    <InformationPanel title="VRT 用の Story です">
      defaultのlocaleが変更されたDropDownを表示して、defaultが切り替わっているかを見ています
    </InformationPanel>
    <All />
  </Stack>
)

VRTDropDown.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const triggers = await canvas.findAllByRole('button', { name: 'Language' })
  await userEvent.click(triggers[2])
}
