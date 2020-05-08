import * as React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import readme from './README.md'

import { SmartHRLogo } from './SmartHRLogo'

storiesOf('SmartHRLogo', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <li>
        <Text>default</Text>
        <SmartHRLogo />
      </li>
      <li>
        <Text>You can set custom title and custom fill color</Text>
        <SmartHRLogo title="custom title" fill="#008d91" />
      </li>
      <li>
        <Text>You can set custom width and height</Text>
        <SmartHRLogo title="custom title" width={111} height={20} />
      </li>
    </List>
  ))

const List = styled.ul`
  margin: 0;
  padding: 8px;
  background-color: #00c4cc;

  & > li {
    display: inline-block;
    padding: 16px;
  }
`
const Text = styled.p`
  margin: 0 0 8px 0;
  font-size: 16px;
`
