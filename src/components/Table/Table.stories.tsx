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
import { Checkbox as CheckboxComponent } from '../Checkbox'
import { Button } from '../Button'

const data = [
  {
    name: 'Tea',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
  },
  {
    name: 'Smoothie',
    calories: 135,
    fat: 0,
    carbs: 34.5,
    protein: 1.0,
  },
  {
    name: 'Milk',
    calories: 138,
    fat: 7.8,
    carbs: 9.9,
    protein: 6.8,
  },
]

storiesOf('Table', module).add('all', () => (
  <Ul>
    <li>
      <Table>
        <Head>
          <Row>
            <Cell>
              <Checkbox name="tableCheckbox" checked={false}></Checkbox>
            </Cell>
            <Cell onClick={action('clicked')}>
              <ClickableCell>
                Name
                <Icon name="fa-angle-down" />
              </ClickableCell>
            </Cell>
            <Cell>Calories</Cell>
            <Cell>Fat (g)</Cell>
            <Cell>Carbs (g)</Cell>
            <Cell>Protein (g)</Cell>
            <Cell>Button</Cell>
          </Row>
        </Head>
        <Body>
          {data.map(({ name, calories, fat, carbs, protein }) => {
            return (
              <Row key={name}>
                <Cell>
                  <Checkbox name="tableCheckbox" checked={false}></Checkbox>
                </Cell>
                <Cell>{name}</Cell>
                <Cell>{calories}</Cell>
                <Cell>{fat}</Cell>
                <Cell>{carbs}</Cell>
                <Cell>{protein}</Cell>
                <Cell>
                  <Button type="sub-a" size="s">
                    Button
                  </Button>
                </Cell>
              </Row>
            )
          })}
        </Body>
      </Table>
    </li>
  </Ul>
))

const Ul = styled.ul`
  list-style: none;
  padding: 0;

  > li {
    margin-top: 2rem;
    padding: 0 2rem;
  }
`

const Checkbox = styled(CheckboxComponent)`
  vertical-align: middle;
`

const ClickableCell = styled.div`
  display: flex;
  align-items: center;
`
