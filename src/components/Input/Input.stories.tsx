import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { FaSearchIcon } from '../Icon'
import { Stack } from '../Layout'

import { CurrencyInput } from './CurrencyInput'
import { Input } from './Input'
import { SearchInput } from './SearchInput'

export default {
  title: 'Forms（フォーム）/Input',
  component: Input,
  subcomponents: { CurrencyInput, SearchInput },
  parameters: {
    withTheming: true,
  },
}

export const All: Story = () => {
  return (
    <List>
      <ListItem>
        <p>text</p>
        <Input name="text" type="text" defaultValue="string" />
      </ListItem>
      <ListItem>
        <p>number</p>
        <Input name="number" type="number" defaultValue="1" />
      </ListItem>
      <ListItem>
        <p>password</p>
        <Input name="password" type="password" defaultValue="password" />
      </ListItem>
      <ListItem>
        <p>width (with %)</p>
        <Input name="width_with_percent" defaultValue="width: 100%" width="100%" />
      </ListItem>
      <ListItem>
        <p>width (with px)</p>
        <Input name="width_with_px" defaultValue="width: 100px" width="100px" />
      </ListItem>
      <ListItem>
        <p>onChange</p>
        <Input name="onChange" onChange={action('onChange!!')} />
      </ListItem>
      <ListItem>
        <p>onBlur</p>
        <Input name="onBlur" onBlur={action('onBlur!!')} />
      </ListItem>
      <ListItem>
        <p>readonly</p>
        <Input name="redOnly" value="これは read-only な input テキスト" readOnly />
      </ListItem>
      <ListItem>
        <p>disabled</p>
        <Input name="disabled" disabled={true} defaultValue="これは disabled なテキスト" />
      </ListItem>
      <ListItem>
        <p>error</p>
        <Input name="error" error={true} />
      </ListItem>
      <ListItem>
        <p>disabled and error</p>
        <p>
          <code>disabled</code>は<code>error</code>よりも優先されます。
        </p>
        <Input name="disabled" disabled={true} error={true} />
      </ListItem>
      <ListItem>
        <p>prefix</p>
        <Input name="prefix" prefix={<FaSearchIcon />} />
      </ListItem>
      <ListItem>
        <p>suffix</p>
        <Input name="suffix" suffix={<FaSearchIcon />} />
      </ListItem>
      <ListItem>
        <p>extending style (width 50%)</p>
        <StyledInput name="extending_style" />
      </ListItem>
    </List>
  )
}
All.storyName = 'all'

export const Currency: Story = () => {
  const [value, setValue] = React.useState('1234567890')
  return (
    <List>
      <ListItem>
        <p>currency (add comma to integer every 3 digits)</p>
        <CurrencyInput
          name="currency"
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
      </ListItem>
    </List>
  )
}
Currency.storyName = 'CurrencyInput'

const List = styled(Stack).attrs({ as: 'ul' })``
const ListItem = styled(Stack).attrs({ gap: 0.5, as: 'ListItem', align: 'flex-start' })``
const StyledInput = styled(Input)`
  width: 50%;
`
