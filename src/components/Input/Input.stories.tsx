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
        <label htmlFor="text">text</label>
        <Input id="text" name="text" type="text" defaultValue="string" />
      </ListItem>
      <ListItem>
        <label htmlFor="number">number</label>
        <Input id="number" name="number" type="number" defaultValue="1" />
      </ListItem>
      <ListItem>
        <label htmlFor="password">password</label>
        <Input id="password" name="password" type="password" defaultValue="password" />
      </ListItem>
      <ListItem>
        <label htmlFor="width_with_percent">width (with %)</label>
        <Input
          id="width_with_percent"
          name="width_with_percent"
          defaultValue="width: 100%"
          width="100%"
        />
      </ListItem>
      <ListItem>
        <label htmlFor="width_with_px">width (with px)</label>
        <Input id="width_with_px" name="width_with_px" defaultValue="width: 100px" width="100px" />
      </ListItem>
      <ListItem>
        <label htmlFor="onChange">onChange</label>
        <Input id="onChange" name="onChange" onChange={action('onChange!!')} />
      </ListItem>
      <ListItem>
        <label htmlFor="onBlur">onBlur</label>
        <Input id="onBlur" name="onBlur" onBlur={action('onBlur!!')} />
      </ListItem>
      <ListItem>
        <label htmlFor="readOnly">readonly</label>
        <Input id="readOnly" name="readOnly" value="これは read-only な input テキスト" readOnly />
      </ListItem>
      <ListItem>
        <label htmlFor="disabled">disabled</label>
        <Input
          id="disabled"
          name="disabled"
          disabled={true}
          defaultValue="これは disabled なテキスト"
        />
      </ListItem>
      <ListItem>
        <label htmlFor="error">error</label>
        <Input id="error" name="error" error={true} />
      </ListItem>
      <ListItem>
        <label htmlFor="disabledAndError">disabled and error</label>
        <p>
          <code>disabled</code>は<code>error</code>よりも優先されます。
        </p>
        <Input id="disabledAndError" name="disabledAndError" disabled={true} error={true} />
      </ListItem>
      <ListItem>
        <label htmlFor="prefix">prefix</label>
        <Input id="prefix" name="prefix" prefix={<FaSearchIcon />} />
      </ListItem>
      <ListItem>
        <label htmlFor="suffix">suffix</label>
        <Input id="suffix" name="suffix" suffix={<FaSearchIcon />} />
      </ListItem>
      <ListItem>
        <label htmlFor="extending_style">extending style (width 50%)</label>
        <StyledInput id="extending_style" name="extending_style" />
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
        <label htmlFor="currency">currency (add comma to integer every 3 digits)</label>
        <CurrencyInput
          id="currency"
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
const ListItem = styled(Stack).attrs({ gap: 0.5, as: 'li', align: 'flex-start' })``
const StyledInput = styled(Input)`
  width: 50%;
`
