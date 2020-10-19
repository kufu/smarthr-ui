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
    const [value, setValue] = React.useState<string>(new Date(2020, 0, 1).toDateString())
    return (
      <List>
        <dt>DatePicker</dt>
        <dd>
          <DatePicker onChangeDate={action('change')} />
        </dd>
        <dt>Custom format (ex. Date.toDateString)</dt>
        <dd>
          <DatePicker
            value={value}
            formatDate={(_date) => {
              if (!_date) return ''
              return _date.toDateString()
            }}
            onChangeDate={(_date, _value) => {
              action('change')(_date, _value)
              setValue(_value)
            }}
          />
        </dd>
        <dt>Disabled</dt>
        <dd>
          <DatePicker disabled />
        </dd>
        <dt>Extending style (width: 50%)</dt>
        <dd>
          <ExtendingDatePicker onChangeDate={action('change')} />
        </dd>
        <dt className="bottom">Place on the page bottom</dt>
        <dd>
          <DatePicker onChangeDate={action('change')} />
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
  dt.bottom {
    margin-top: 1000px;
  }
`

const ExtendingDatePicker = styled(DatePicker)`
  width: 50%;
`
