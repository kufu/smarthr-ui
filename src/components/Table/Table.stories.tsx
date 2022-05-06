import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { Table } from './Table'
import { Body } from './Body'
import { Head } from './Head'
import { Row } from './Row'
import { BulkActionRow, Td, Th } from './'
import { FaArrowDownIcon } from '../Icon'
import { CheckBox as CheckBoxComponent } from '../CheckBox'
import { SecondaryButton as Button } from '../Button'
import { Base as BaseComponent } from '../Base'

import readme from './README.md'
import { VISUALLY_HIDDEN_STYLE } from '../../constants'

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
    calories: 10,
    fat: 0,
    carbs: 34.5,
    protein: 1.0,
  },
  {
    name: 'Milk',
    calories: 199,
    fat: 7.8,
    carbs: 9.9,
    protein: 6.8,
  },
  {
    name: 'Coffee',
    calories: 39,
    fat: 7.8,
    carbs: 10.9,
    protein: 0,
  },
  {
    name: 'Orange Juice',
    calories: 200,
    fat: 100.0,
    carbs: 10,
    protein: 300,
  },
  {
    name: 'Apple Juice',
    calories: 130,
    fat: 200,
    carbs: 99,
    protein: 68,
  },
  {
    name: 'Green Tea',
    calories: 300,
    fat: 100,
    carbs: 10,
    protein: 41,
  },
  {
    name: 'Oolong Tea',
    calories: 100,
    fat: 10,
    carbs: 9,
    protein: 600,
  },
]

storiesOf('Table', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Ul>
      <li>
        table
        <Table>
          <thead>
            <Row>
              <Th>
                <VisuallyHiddenText>行を選択</VisuallyHiddenText>
                <label htmlFor="tableAllCheckBox">
                  <VisuallyHiddenText>すべての行を選択</VisuallyHiddenText>
                  <CheckBox name="tableAllCheckBox" checked={false} id="tableAllCheckBox" />
                </label>
              </Th>
              <Th aria-sort="ascending" highlighted={true}>
                <ClickableCellInner onClick={action('clicked')}>
                  <span style={{ lineHeight: '1.5' }}>Name</span>
                  <Arrow visuallyHiddenText="昇順" />
                </ClickableCellInner>
              </Th>
              <Th>Calories</Th>
              <Th>Fat (g)</Th>
              <Th>Carbs (g)</Th>
              <Th>Protein (g)</Th>
              <Th>Button</Th>
            </Row>
            <BulkActionRow>Bulk action area</BulkActionRow>
          </thead>
          <Body>
            {data.map(({ name, calories, fat, carbs, protein }) => {
              return (
                <Row key={name}>
                  <Td>
                    <label htmlFor="tableCheckBox">
                      <VisuallyHiddenText>{name}</VisuallyHiddenText>
                      <CheckBox name="tableCheckBox" checked={false} id="tableCheckBox" />
                    </label>
                  </Td>
                  <Td>{name}</Td>
                  <Td>{calories}</Td>
                  <Td>{fat}</Td>
                  <Td>{carbs}</Td>
                  <Td>{protein}</Td>
                  <Td>
                    <Button size="s">Button</Button>
                  </Td>
                </Row>
              )
            })}
          </Body>
        </Table>
      </li>
      <li>
        table fixed header
        <div style={{ overflow: 'clip' }}>
          <Table fixedHead>
            <thead>
              <Row>
                <Th>
                  <VisuallyHiddenText>行を選択</VisuallyHiddenText>
                  <label htmlFor="tableAllCheckBox">
                    <VisuallyHiddenText>すべての行を選択</VisuallyHiddenText>
                    <CheckBox name="tableAllCheckBox" checked={false} id="tableAllCheckBox" />
                  </label>
                </Th>
                <Th aria-sort="ascending" highlighted={true}>
                  <ClickableCellInner onClick={action('clicked')}>
                    <span style={{ lineHeight: '1.5' }}>Name</span>
                    <Arrow visuallyHiddenText="昇順" />
                  </ClickableCellInner>
                </Th>
                <Th>Calories</Th>
                <Th>Fat (g)</Th>
                <Th>Carbs (g)</Th>
                <Th>Protein (g)</Th>
                <Th>Button</Th>
              </Row>
              <BulkActionRow>Bulk action area</BulkActionRow>
            </thead>
            <Body>
              {data.map(({ name, calories, fat, carbs, protein }) => {
                return (
                  <Row key={name}>
                    <Td>
                      <label htmlFor="tableCheckBox">
                        <VisuallyHiddenText>{name}</VisuallyHiddenText>
                        <CheckBox name="tableCheckBox" checked={false} id="tableCheckBox" />
                      </label>
                    </Td>
                    <Td>{name}</Td>
                    <Td>{calories}</Td>
                    <Td>{fat}</Td>
                    <Td>{carbs}</Td>
                    <Td>{protein}</Td>
                    <Td>
                      <Button size="s">Button</Button>
                    </Td>
                  </Row>
                )
              })}
            </Body>
          </Table>
        </div>
      </li>
      <li>
        colSpan / rowSpan
        <Table>
          <Head>
            <Row>
              <Th colSpan={3}>colSpan=3</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
            </Row>
          </Head>
          <Body>
            <Row>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
            </Row>
            <Row>
              <Td rowSpan={2}>rowSpan=2</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
            </Row>
            <Row>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
            </Row>
          </Body>
        </Table>
      </li>
      <li>
        Table on Base
        <Base>
          <Table>
            <Head>
              <Row>
                <Th>cell</Th>
                <Th>cell</Th>
                <Th>cell</Th>
              </Row>
            </Head>
            <Body>
              <Row>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
              </Row>
              <Row>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
              </Row>
              <Row>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>
                  multi
                  <br />
                  line
                </Td>
              </Row>
              <Row>
                <Td nullable={true}></Td>
                <Td nullable={true}>not null</Td>
                <Td nullable={false}></Td>
              </Row>
            </Body>
          </Table>
        </Base>
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

const CheckBox = styled(CheckBoxComponent)`
  vertical-align: middle;
`

const ClickableCellInner = styled.button`
  appearance: none;
  padding: 8px 16px;
  border: 0;
  box-sizing: border-box;
  background-color: transparent;
  width: calc(100% + 32px);
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: -8px -16px;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
`

const Arrow = styled(FaArrowDownIcon)`
  transform: rotate(180deg);
`

const Base = styled(BaseComponent)`
  overflow-x: auto;
`

const VisuallyHiddenText = styled.span`
  ${VISUALLY_HIDDEN_STYLE}
`
