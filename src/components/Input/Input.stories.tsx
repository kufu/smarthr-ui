import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Input } from './Input'
import { FaSearchIcon } from '../Icon'

storiesOf('Input', module).add('all', () => {
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
        {' '}
        <Txt>placeholder</Txt>
        <Input placeholder="string" />
      </li>
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
        <Input disabled={true} />
      </li>
      <li>
        <Txt>error</Txt>
        <Input error={true} />
      </li>
      <li>
        <Txt>disabled and error</Txt>
        <Input disabled={true} error={true} />
        <Note themes={theme}>`disabled` takes precedence over `error`</Note>
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
})

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
