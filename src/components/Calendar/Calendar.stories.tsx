import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'

import { Calendar } from './Calendar'

storiesOf('Calendar', module).add('All', () => {
  const [value, setValue] = useState(new Date())
  return (
    <Wrapper>
      <Calendar onSelectDate={(_, date) => setValue(date)} value={value} />
    </Wrapper>
  )
})

const Wrapper = styled.div`
  padding: 16px;
`
