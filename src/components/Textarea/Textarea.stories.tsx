import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Textarea } from './Textarea'

import readme from './README.md'

storiesOf('Textarea', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [value, setValue] = useState('message👌')
    const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setValue(e.currentTarget.value)
    return (
      <List>
        <li>
          <Txt>normal</Txt>
          <Textarea />
        </li>
        <li>
          <Txt>width</Txt>
          <Textarea width="100%" />
        </li>
        <li>
          <Txt>disabled</Txt>
          <Textarea disabled={true} />
        </li>
        <li>
          <Txt>error</Txt>
          <Textarea error={true} />
        </li>
        <li>
          <Txt>maxLength (defaultValue)</Txt>
          <Textarea maxLength={140} defaultValue="message👌" />
        </li>
        <li>
          <Txt>maxLength (value)</Txt>
          <Textarea maxLength={140} value={value} onChange={onChangeValue} />
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
  margin: 0 0 8px 0;
`
