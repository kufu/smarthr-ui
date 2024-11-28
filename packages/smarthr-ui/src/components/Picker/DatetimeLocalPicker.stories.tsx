import { StoryFn } from '@storybook/react/*'
import React from 'react'

import { FormControl } from '../FormControl'

import { DatetimeLocalPicker } from './DatetimeLocalPicker'

export default {
  title: 'Forms（フォーム）/DatetimeLocalPicker',
  component: DatetimeLocalPicker,
}

const _Template: StoryFn = (args) => (
  <ul className="shr-list-none shr-space-y-1">
    <li>
      <FormControl title="月">
        <DatetimeLocalPicker {...args} name="datetimelocal" />
      </FormControl>
    </li>
    <li>
      <FormControl title="非活性">
        <DatetimeLocalPicker {...args} disabled={true} name="disabled" />
      </FormControl>
    </li>
    <li>
      <FormControl title="エラーあり" autoBindErrorInput={false}>
        <DatetimeLocalPicker {...args} error={true} name="error" />
      </FormControl>
    </li>
    <li>
      <FormControl title="エラーあり with FormControl" errorMessages={['エラーメッセージ']}>
        <DatetimeLocalPicker {...args} name="error_With_formcontrol" />
      </FormControl>
    </li>
    <li>
      <FormControl title="読み取り専用">
        <DatetimeLocalPicker {...args} readOnly={true} name="read_only" />
      </FormControl>
    </li>
  </ul>
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
