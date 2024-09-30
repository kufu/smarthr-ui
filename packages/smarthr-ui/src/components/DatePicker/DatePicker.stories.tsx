import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { FormControl } from '../FormControl'
import { Stack } from '../Layout'

import { DatePicker } from './DatePicker'

export default {
  title: 'Forms（フォーム）/DatePicker',
  component: DatePicker,
}

export const All: StoryFn = () => {
  const [value, setValue] = React.useState<string>(new Date(2020, 0, 1).toDateString())

  return (
    <Stack>
      <FormControl title="DatePicker">
        <DatePicker name="default" onChangeDate={action('change')} data-test="datepicker-1" />
      </FormControl>
      <FormControl title="Pass `from`, `to`">
        <DatePicker
          name="from_to"
          from={new Date(1901, 0, 1)}
          to={new Date(2100, 11, 30)}
          onChangeDate={action('change')}
          onBlur={action('blur')}
        />
      </FormControl>
      <FormControl title="Custom format (ex. Date.toDateString)">
        <DatePicker
          name="custom_format"
          value={value}
          formatDate={(_date) => {
            if (!_date) return ''
            return _date.toDateString()
          }}
          onChangeDate={(_date, _value, _other) => {
            action('change')(_date, _value, _other)
            setValue(_value)
          }}
        />
      </FormControl>
      <FormControl title="Show Alternative Formatted Date">
        <DatePicker
          name="show_alternative"
          value="1994/09/28"
          showAlternative={() => '平成6年9月28日'}
        />
      </FormControl>
      <FormControl title="Show Alternative Formatted Date(ReactNode)">
        <DatePicker
          name="show_alternative"
          value="1994/09/28"
          showAlternative={() => <span data-translate="true">平成6年9月28日</span>}
        />
      </FormControl>
      <FormControl title="Disabled">
        <DatePicker name="disabled" disabled />
      </FormControl>
      <FormControl title="Extending style (width: 50%)">
        <DatePicker name="extending_style" width="50%" onChangeDate={action('change')} />
      </FormControl>
      <BottomFormControl title="Place on the page bottom">
        <DatePicker name="place_on_the_page_bottom" onChangeDate={action('change')} />
      </BottomFormControl>
      <FormControl title="error" autoBindErrorInput={false}>
        <DatePicker name="error" error={true} />
      </FormControl>
      <FormControl title="error with FormControl" errorMessages={['エラーメッセージ']}>
        <DatePicker name="error" />
      </FormControl>
    </Stack>
  )
}
All.storyName = 'all'

const BottomFormControl = styled(FormControl)`
  margin-top: 1000px;
`
