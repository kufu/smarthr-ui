import { storiesOf } from '@storybook/react'
import * as React from 'react'

import styled from 'styled-components'

import Table from './Table'
import Body from './Body'
import Head from './Head'
import Row from './Row'
import Cell from './Cell'
import { action } from '@storybook/addon-actions'
import { Icon } from '../Icon'

storiesOf('Table', module).add('all', () => (
  <Ul>
    <li>
      <Table>
        <Head>
          <Row>
            <Cell onClick={action('clicked')}>
              Clickable cell <Icon name="fa-angle-down" />
            </Cell>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
          </Row>
        </Head>
        <Body>
          <Row>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
            <Cell>cell</Cell>
          </Row>
        </Body>
      </Table>
    </li>
  </Ul>
))

const Ul = styled.ul`
  list-style: none;

  > li {
    margin-top: 2rem;
  }
`
