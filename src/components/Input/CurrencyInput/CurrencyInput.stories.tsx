import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { CurrencyInput } from './CurrencyInput'

storiesOf('Input/currency', module).add('all', () => {
  const [value, setValue] = React.useState('1234567890')
  return (
    <Wrapper>
      <Txt>currency (add comma to integer every 3 digits)</Txt>
      <CurrencyInput
        value={value}
        onChangeValue={(changed) => {
          action('changed value')(changed)
          setValue(changed)
        }}
      />
    </Wrapper>
  )
})

const Txt = styled.p`
  margin: 0 0 8px 0;
`
const Wrapper = styled.div`
  padding: 24px;
`
