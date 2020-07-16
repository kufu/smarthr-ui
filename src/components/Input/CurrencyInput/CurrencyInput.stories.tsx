import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { CurrencyInput } from './CurrencyInput'
import readme from './README.md'

storiesOf('Input/currency', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [value, setValue] = React.useState('1234567890')
    return (
      <Wrapper>
        <Txt>currency (add comma to integer every 3 digits)</Txt>
        <CurrencyInput
          value={value}
          onChange={(e) => {
            action('changed')(e)
            setValue(e.target.value)
          }}
          onFormatValue={(formatted) => {
            action('formatted')(formatted)
            setValue(formatted)
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
