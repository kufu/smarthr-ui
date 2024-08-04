import { StoryFn } from '@storybook/react/*'
import React from 'react'

import { TimePicker } from './TimePicker'

export default {
  title: 'Forms（フォーム）/TimePicker',
  component: TimePicker,
}

const _Template: StoryFn = (args) => <TimePicker {...args} />

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
