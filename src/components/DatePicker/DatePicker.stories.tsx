import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { DatePicker } from './DatePicker'
import readme from './README.md'

storiesOf('DatePicker', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [date, setDate] = React.useState<Date | null>(new Date(2020, 0, 1))
    return (
      <List>
        <dt>DatePicker</dt>
        <dd>
          <DatePicker onChangeDate={action('change date')} />
        </dd>
        <dt>Custom format (ex. Date.toDateString)</dt>
        <dd>
          <DatePicker
            date={date}
            onChangeDate={(_date) => setDate(_date)}
            formatDate={(_date) => {
              if (!_date) return ''
              return _date.toDateString()
            }}
          />
        </dd>
        <dt>Extending style (width: 50%)</dt>
        <dd>
          <ExtendingDatePicker />
        </dd>
      </List>
    )
  })

const List = styled.dl`
  padding: 24px;
  margin: 0;

  dd {
    margin: 10px 0 20px;
  }
`

const ExtendingDatePicker = styled(DatePicker)`
  width: 50%;
`
