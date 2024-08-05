import { StoryFn } from '@storybook/react/*'
import React from 'react'

import { FormControl } from '../FormControl'

import { TimePicker } from './TimePicker'

export default {
  title: 'Forms（フォーム）/TimePicker',
  component: TimePicker,
}

const _Template: StoryFn = (args) => (
  <FormControl title="時刻">
    <TimePicker {...args} />
  </FormControl>
)

export const Default = _Template.bind({})

export const VRTFocus = _Template.bind({})
VRTFocus.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    focusWithin: ['span:has(> input)'],
  },
}

export const VRTForcedColors = _Template.bind({})
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
