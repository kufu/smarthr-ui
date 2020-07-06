import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import { Calendar } from './Calendar'

import readme from './README.md'

storiesOf('Calendar', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('All', () => {
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
  })

const List = styled.dl`
  margin: 1rem;
  & > dd {
    margin: 10px 0 40px;
  }
`
