import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Input } from './Input'
import { CurrencyInput } from './CurrencyInput'

import { Icon } from '../Icon'

storiesOf('Input', module).add('all', () => (
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
      <Txt>number (thousands separated)</Txt>
      <CurrencyInput />
    </li>
    <li>
      <Txt>password</Txt>
      <Input type="password" defaultValue="password" />
    </li>
    <li>
      <Txt>placeholder</Txt>
      <Input placeholder="string" />
    </li>
    <li>
      <Txt>width</Txt>
      <Input defaultValue="width: 100%" width="100%" />
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
      <Txt>prefix</Txt>
      <Input prefix={<Icon name="fa-search" color="#d6d6d6" />} />
    </li>
    <li>
      <Txt>suffix</Txt>
      <Input suffix={<Icon name="fa-search" color="#d6d6d6" />} />
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 16px;
  }
`
const Txt = styled.p`
  margin: 0 0 8px 0;
`
