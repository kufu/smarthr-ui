import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { NumberInput, PasswordInput, TextInput } from './Input'

storiesOf('Input', module).add('all', () => (
  <List>
    <li>
      <Txt>text</Txt>
      <TextInput name="sample" value="string" />
    </li>
    <li>
      <Txt>number</Txt>
      <NumberInput name="sample" value="1" />
    </li>
    <li>
      <Txt>password</Txt>
      <PasswordInput name="sample" value="password" />
    </li>
    <li>
      <Txt>placeholder</Txt>
      <TextInput name="sample" value="" placeholder="string" />
    </li>
    <li>
      <Txt>width</Txt>
      <TextInput name="sample" value="width: 100%" width="100%" />
    </li>
    <li>
      <Txt>onChange</Txt>
      <TextInput name="sample" value="" onChange={action('onChange!!')} />
    </li>
    <li>
      <Txt>onBlur</Txt>
      <TextInput name="sample" value="" onBlur={action('onBlur!!')} />
    </li>
    <li>
      <Txt>disabled</Txt>
      <TextInput name="sample" value="" disabled={true} />
    </li>
    <li>
      <Txt>error</Txt>
      <TextInput name="sample" value="" error={true} />
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
