import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { VISUALLY_HIDDEN_STYLE } from '../../constants'
import { Base as BaseComponent } from '../Base'
import { Button } from '../Button'
import { CheckBox as CheckBoxComponent } from '../CheckBox'
import { FaArrowDownIcon } from '../Icon'
import { Text } from '../Text'

import { BulkActionRow, EmptyTableBody, Table, Td, Th } from '.'

export default {
  title: 'Data Display（データ表示）/Table',
  component: Table,
  subcomponents: { Th, Td, BulkActionRow },
}

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

export const All: Story = () => (
  <Ul>
    <li>
      table
      <Table>
        <thead>
          <tr>
            <Th>
              <VisuallyHiddenText>行を選択</VisuallyHiddenText>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>
                <VisuallyHiddenText>すべての行を選択</VisuallyHiddenText>
                <CheckBox name="tableAllCheckBox" checked={false} />
              </label>
            </Th>
            <Th aria-sort="ascending" highlighted={true}>
              <ClickableCellButton onClick={action('clicked')}>
                <span style={{ lineHeight: '1.5' }}>Name</span>
                <ArrowIcon alt="昇順" />
              </ClickableCellButton>
            </Th>
            <Th>Calories</Th>
            <Th>Fat (g)</Th>
            <Th>Carbs (g)</Th>
            <Th>Protein (g)</Th>
            <Th>Button</Th>
          </tr>
          <BulkActionRow>Bulk action area</BulkActionRow>
        </thead>
        <tbody>
          {data.map(({ name, calories, fat, carbs, protein }) => (
            <tr key={name}>
              <Td>
                <label>
                  <VisuallyHiddenText>{name}</VisuallyHiddenText>
                  <CheckBox name="tableCheckBox" checked={false} />
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
            </tr>
          ))}
          )
        </tbody>
      </Table>
    </li>
    <li>
      table fixed header
      <div style={{ overflow: 'clip' }}>
        <Table fixedHead>
          <thead>
            <tr>
              <Th>
                <VisuallyHiddenText>行を選択</VisuallyHiddenText>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>
                  <VisuallyHiddenText>すべての行を選択</VisuallyHiddenText>
                  <CheckBox name="tableAllCheckBox" checked={false} />
                </label>
              </Th>
              <Th aria-sort="ascending" highlighted={true}>
                <ClickableCellButton onClick={action('clicked')}>
                  <span style={{ lineHeight: '1.5' }}>Name</span>
                  <ArrowIcon alt="昇順" />
                </ClickableCellButton>
              </Th>
              <Th>Calories</Th>
              <Th>Fat (g)</Th>
              <Th>Carbs (g)</Th>
              <Th>Protein (g)</Th>
              <Th>Button</Th>
            </tr>
            <BulkActionRow>Bulk action area</BulkActionRow>
          </thead>
          <tbody>
            {data.map(({ name, calories, fat, carbs, protein }) => (
              <tr key={name}>
                <Td>
                  <label>
                    <VisuallyHiddenText>{name}</VisuallyHiddenText>
                    <CheckBox name="tableCheckBox" checked={false} />
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
              </tr>
            ))}
            )
          </tbody>
        </Table>
      </div>
    </li>
    <li>
      colSpan / rowSpan
      <Table>
        <thead>
          <tr>
            <Th colSpan={3}>colSpan=3</Th>
            <Th>cell</Th>
            <Th>cell</Th>
            <Th>cell</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
          </tr>
          <tr>
            <Td rowSpan={2}>rowSpan=2</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
          </tr>
          <tr>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
            <Td>cell</Td>
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
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
            </tr>
            <tr>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
            </tr>
            <tr>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>
                multi
                <br />
                line
              </Td>
            </tr>
            <tr>
              <Td nullable={true}></Td>
              <Td nullable={true}>not null</Td>
              <Td nullable={false}></Td>
            </tr>
          </tbody>
        </Table>
      </Base>
    </li>

    <li>
      Table with empty state
      <Base>
        <Table>
          <thead>
            <tr>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
            </tr>
          </thead>
          <EmptyTableBody>
            <Text>お探しの条件に該当する項目はありません。</Text>
            <Text>別の条件をお試しください。</Text>
          </EmptyTableBody>
        </Table>
      </Base>
    </li>
  </Ul>
)
All.storyName = 'all'

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

const ClickableCellButton = styled.button`
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

const ArrowIcon = styled(FaArrowDownIcon)`
  transform: rotate(180deg);
`

const Base = styled(BaseComponent)`
  overflow-x: auto;
`

const VisuallyHiddenText = styled.span`
  ${VISUALLY_HIDDEN_STYLE}
`
