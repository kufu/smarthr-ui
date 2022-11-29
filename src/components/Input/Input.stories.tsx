import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaSearchIcon } from '../Icon'

import { CurrencyInput } from './CurrencyInput'
import { Input } from './Input'
import { SearchInput } from './SearchInput'

export default {
  title: 'Input',
  component: Input,
  subcomponents: { CurrencyInput, SearchInput },
  parameters: {
    withTheming: true,
  },
}

export const All: Story = () => {
  const theme = useTheme()

  return (
    <List>
      <li>
        <Txt>text</Txt>
        <Input type="text" defaultValue="string" />
      </li>
      <li>
        <Txt>number</Txt>
        <Input type="number" defaultValue="1" />
      </li>
      <li>
        <Txt>password</Txt>
        <Input type="password" defaultValue="password" />{' '}
      </li>{' '}
      <li>
        <Txt>width (with %)</Txt>
        <Input defaultValue="width: 100%" width="100%" />
      </li>
      <li>
        <Txt>width (with px)</Txt>
        <Input defaultValue="width: 100px" width="100px" />
      </li>
      <li>
        <Txt>onChange</Txt>
        <Input onChange={action('onChange!!')} />
      </li>
      <li>
        <Txt>onBlur</Txt>
        <Input onBlur={action('onBlur!!')} />
      </li>
      <li>
        <Txt>disabled</Txt>
        <Input disabled={true} defaultValue="これは disabled なテキスト" />
      </li>
      <li>
        <Txt>error</Txt>
        <Input error={true} />
      </li>
      <li>
        <Txt>disabled and error</Txt>
        <Input disabled={true} error={true} />
        <Note themes={theme}> `disabled` takes precedence over `error`</Note>
      </li>
      <li>
        <Txt>prefix</Txt>
        <Input prefix={<FaSearchIcon />} />
      </li>
      <li>
        <Txt>suffix</Txt>
        <Input suffix={<FaSearchIcon />} />
      </li>
      <li>
        <Txt>extending style (width 50%)</Txt>
        <StyledInput />
      </li>
    </List>
  )
}
All.storyName = 'all'

export const Currency: Story = () => {
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
}
Currency.storyName = 'CurrencyInput'

export { Default as SearchInput } from './SearchInput/SearchInput.stories'

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 16px;
  }
`
const Txt = styled.p`
  margin: 0 0 8px;
`
const StyledInput = styled(Input)`
  width: 50%;
`
const Note = styled.div<{ themes: Theme }>`
  ${({ themes }) => css`
    margin-top: 8px;
    color: ${themes.color.TEXT_GREY};
  `}
`
const Wrapper = styled.div`
  padding: 24px;
`
