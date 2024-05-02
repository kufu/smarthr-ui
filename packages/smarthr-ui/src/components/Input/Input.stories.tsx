import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { FormControl } from '../FormControl'
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

export const All: StoryFn = () => (
  <ListStack>
    <li>
      <FormControl title="text">
        <Input name="text" type="text" defaultValue="string" />
      </FormControl>
    </li>
    <li>
      <FormControl title="number">
        <Input name="number" type="number" defaultValue="1" />
      </FormControl>
    </li>
    <li>
      <FormControl title="password">
        <Input name="password" type="password" defaultValue="password" />
      </FormControl>
    </li>
    <li>
      <FormControl title="width (with %)">
        <Input name="width_with_percent" defaultValue="width: 100%" width="100%" />
      </FormControl>
    </li>
    <li>
      <FormControl title="width (with px)">
        <Input name="width_with_px" defaultValue="width: 100px" width="100px" />
      </FormControl>
    </li>
    <li>
      <FormControl title="onChange">
        <Input name="onChange" onChange={action('onChange!!')} />
      </FormControl>
    </li>
    <li>
      <FormControl title="onBlur">
        <Input name="onBlur" onBlur={action('onBlur!!')} />
      </FormControl>
    </li>
    <li>
      <FormControl title="readOnly">
        <Input name="readOnly" value="これは read-only な input テキスト" readOnly />
      </FormControl>
    </li>
    <li>
      <FormControl title="disabled">
        <Input name="disabled" disabled={true} defaultValue="これは disabled なテキスト" />
      </FormControl>
    </li>
    <li>
      <FormControl title="error">
        <Input name="error" error={true} />
      </FormControl>
    </li>
    <li>
      <FormControl
        title="disabled and error"
        helpMessage={
          <>
            <code>disabled</code>は<code>error</code>よりも優先されます。
          </>
        }
      >
        <Input name="disabledAndError" disabled={true} error={true} />
      </FormControl>
    </li>
    <li>
      <FormControl title="prefix">
        <Input name="prefix" prefix={<FaSearchIcon />} />
      </FormControl>
    </li>
    <li>
      <FormControl title="suffix">
        <Input name="suffix" suffix={<FaSearchIcon />} />
      </FormControl>
    </li>
    <li>
      <FormControl htmlFor="extending_style" title="extending style (width 50%)">
        <StyledInput id="extending_style" name="extending_style" />
      </FormControl>
    </li>
  </ListStack>
)
All.storyName = 'all'

export const Currency: StoryFn = () => {
  const [value, setValue] = React.useState('1234567890')
  return (
    // eslint-disable-next-line smarthr/best-practice-for-layouts
    <ListStack>
      <li>
        <FormControl title="currency (add comma to integer every 3 digits)">
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
        </FormControl>
      </li>
    </ListStack>
  )
}
Currency.storyName = 'CurrencyInput'

const ListStack = styled(Stack).attrs({ forwardedAs: 'ul' })`
  list-style-type: none;
`
const StyledInput = styled(Input)`
  width: 50%;
`
