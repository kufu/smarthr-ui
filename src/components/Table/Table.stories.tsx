import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { BulkActionRow, Table } from '.'
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
            <tr>
              <th>
                <VisuallyHiddenText>行を選択</VisuallyHiddenText>
                <label htmlFor="tableAllCheckBox">
                  <VisuallyHiddenText>すべての行を選択</VisuallyHiddenText>
                  <CheckBox name="tableAllCheckBox" checked={false} id="tableAllCheckBox" />
                </label>
              </th>
              <th aria-sort="ascending" className="highlighted">
                <ClickableCellInner onClick={action('clicked')}>
                  <span style={{ lineHeight: '1.5' }}>Name</span>
                  <Arrow visuallyHiddenText="昇順" />
                </ClickableCellInner>
              </th>
              <th>Calories</th>
              <th>Fat (g)</th>
              <th>Carbs (g)</th>
              <th>Protein (g)</th>
              <th>Button</th>
            </tr>
            <BulkActionRow>Bulk action area</BulkActionRow>
          </thead>
          <tbody>
            {data.map(({ name, calories, fat, carbs, protein }) => {
              return (
                <tr key={name}>
                  <td>
                    <label htmlFor="tableCheckBox">
                      <VisuallyHiddenText>{name}</VisuallyHiddenText>
                      <CheckBox name="tableCheckBox" checked={false} id="tableCheckBox" />
                    </label>
                  </td>
                  <td>{name}</td>
                  <td>{calories}</td>
                  <td>{fat}</td>
                  <td>{carbs}</td>
                  <td>{protein}</td>
                  <td>
                    <Button size="s">Button</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </li>
      <li>
        table fixed header
        <div style={{ overflow: 'clip' }}>
          <Table fixedHead>
            <thead>
              <tr>
                <th>
                  <VisuallyHiddenText>行を選択</VisuallyHiddenText>
                  <label htmlFor="tableAllCheckBox">
                    <VisuallyHiddenText>すべての行を選択</VisuallyHiddenText>
                    <CheckBox name="tableAllCheckBox" checked={false} id="tableAllCheckBox" />
                  </label>
                </th>
                <th aria-sort="ascending" className="highlighted">
                  <ClickableCellInner onClick={action('clicked')}>
                    <span style={{ lineHeight: '1.5' }}>Name</span>
                    <Arrow visuallyHiddenText="昇順" />
                  </ClickableCellInner>
                </th>
                <th>Calories</th>
                <th>Fat (g)</th>
                <th>Carbs (g)</th>
                <th>Protein (g)</th>
                <th>Button</th>
              </tr>
              <BulkActionRow>Bulk action area</BulkActionRow>
            </thead>
            <tbody>
              {data.map(({ name, calories, fat, carbs, protein }) => {
                return (
                  <tr key={name}>
                    <td>
                      <label htmlFor="tableCheckBox">
                        <VisuallyHiddenText>{name}</VisuallyHiddenText>
                        <CheckBox name="tableCheckBox" checked={false} id="tableCheckBox" />
                      </label>
                    </td>
                    <td>{name}</td>
                    <td>{calories}</td>
                    <td>{fat}</td>
                    <td>{carbs}</td>
                    <td>{protein}</td>
                    <td>
                      <Button size="s">Button</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </li>
      <li>
        colSpan / rowSpan
        <Table>
          <thead>
            <tr>
              <th colSpan={3}>colSpan=3</th>
              <th>cell</th>
              <th>cell</th>
              <th>cell</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
            </tr>
            <tr>
              <td rowSpan={2}>rowSpan=2</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
            </tr>
            <tr>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
              <td>cell</td>
            </tr>
          </tbody>
        </Table>
      </li>
      <li>
        Table on Base
        <Base>
          <Table>
            <thead>
              <tr>
                <th>cell</th>
                <th>cell</th>
                <th>cell</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>cell</td>
                <td>cell</td>
                <td>cell</td>
              </tr>
              <tr>
                <td>cell</td>
                <td>cell</td>
                <td>cell</td>
              </tr>
              <tr>
                <td>cell</td>
                <td>cell</td>
                <td>
                  multi
                  <br />
                  line
                </td>
              </tr>
            </tbody>
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
