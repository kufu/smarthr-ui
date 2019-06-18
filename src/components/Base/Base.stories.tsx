import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Base } from './Base'

storiesOf('Base', module).add('all', () => (
  <List>
    <li>
      <Base radius="s">
        <Txt>radius s</Txt>
      </Base>
    </li>
    <li>
      <Base radius="m">
        <Txt>radius m</Txt>
      </Base>
    </li>
  </List>
))

const List = styled.ul`
  padding: 8px 24px;
  list-style: none;
`

const Txt = styled.p`
  padding: 8px;
`
