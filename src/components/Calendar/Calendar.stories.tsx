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
    const [value, setValue] = useState(new Date())
    return (
      <Wrapper>
        <Calendar
          onSelectDate={(e, date) => {
            action('selected')(e, date)
            setValue(date)
          }}
          value={value}
        />
      </Wrapper>
    )
  })

const Wrapper = styled.div`
  padding: 16px;
`
