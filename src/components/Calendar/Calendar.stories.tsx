import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Calendar } from './Calendar'

export default {
  title: 'Data Display（データ表示）/Calendar',
  component: Calendar,
}

export const All: Story = () => {
  const [value, setValue] = useState(new Date(2020, 0, 1))
  const [value2, setValue2] = useState(new Date(2020, 0, 20))
  return (
    <List>
      <dt>Default</dt>
      <dd>
        <Calendar
          onSelectDate={(e, date) => {
            action('selected')(e, date)
            setValue(date)
          }}
          value={value}
          data-test="calendar-1"
        />
      </dd>
      <dt>You can set term of selectable date by setting [from] and [to].</dt>
      <dd>
        <Calendar
          from={new Date(2020, 0, 10)}
          to={new Date(2020, 1, 10)}
          onSelectDate={(e, date) => {
            action('selected')(e, date)
            setValue2(date)
          }}
          value={value2}
        />
      </dd>
    </List>
  )
}

const List = styled.dl`
  margin: 1rem;
  & > dd {
    margin: 10px 0 40px;
  }
`
