import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Base } from '../Base'
import { Button } from '../Button'
import { Text } from '../Text'

import { TdCheckbox } from './TdCheckbox'
import { ThCheckbox } from './ThCheckbox'

import { BulkActionRow, EmptyTableBody, Table, TableReel, Td, Th } from '.'

export default {
  title: 'Data Display（データ表示）/Table',
  component: Table,
  subcomponents: { Th, Td, BulkActionRow },
  parameters: {
    withTheming: true,
  },
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
            <ThCheckbox name="tableAllCheckbox" />
            <Th sort="asc" onSort={action('降順に並び替え')}>
              Name
            </Th>
            <Th sort="none" onSort={action('昇順に並び替え')}>
              Calories
            </Th>
            <Th>Fat (g)</Th>
            <Th>Carbs (g)</Th>
            <Th>Protein (g)</Th>
            <Th>Button</Th>
          </tr>
          <BulkActionRow>Bulk action area</BulkActionRow>
        </thead>
        <tbody>
          {data.map(({ name, calories, fat, carbs, protein }, i) => (
            <tr key={name}>
              <TdCheckbox name={`tableCheckBox-${i}`} aria-labelledby={`name-${i}`} />
              <Td id={`name-${i}`}>{name}</Td>
              <Td>{calories}</Td>
              <Td>{fat}</Td>
              <Td>{carbs}</Td>
              <Td>{protein}</Td>
              <Td>
                <Button size="s">Button</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </li>
    <li>
      行頭で改行が発生する場合
      <Table>
        <thead>
          <tr>
            <ThCheckbox name="tableAllCheckbox" checked={true} mixed />
            <Th sort="asc" onSort={action('降順に並び替え')}>
              Name
            </Th>
            <Th sort="none" onSort={action('昇順に並び替え')}>
              Calories
              <br />
              (kcal)
            </Th>
            <Th>
              Fat
              <br />
              (g)
            </Th>
            <Th>Carbs (g)</Th>
            <Th>Protein (g)</Th>
            <Th>Button</Th>
          </tr>
        </thead>
      </Table>
    </li>
    <li>
      table fixed header
      <div style={{ overflow: 'clip' }}>
        <Table fixedHead>
          <thead>
            <tr>
              <ThCheckbox name="tableAllCheckbox" />
              <Th
                sort="desc"
                onSort={action('昇順に並び替え')}
                decorators={{ sortDirectionIconAlt: (text, { sort }) => `${sort} (${text})` }}
              >
                Name
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
            {data.map(({ name, calories, fat, carbs, protein }, i) => (
              <tr key={name}>
                <TdCheckbox name={`tableCheckBox-${i}`} aria-labelledby={`name-fixed-${i}`} />
                <Td id={`name-fixed-${i}`}>{name}</Td>
                <Td>{calories}</Td>
                <Td>{fat}</Td>
                <Td>{carbs}</Td>
                <Td>{protein}</Td>
                <Td>
                  <Button size="s">Button</Button>
                </Td>
              </tr>
            ))}
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
      <Base overflow="auto">
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
      <Base overflow="auto">
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

export const WithReel: Story = () => (
  <Ul>
    <li>
      TableReel
      <TableReel>
        <Table>
          <thead>
            <tr>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>
                multi
                <br />
                line
              </Th>
              <Th fixed>cell</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>株式会社SmartHR</Td>
              <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>
                multi
                <br />
                line
              </Td>
              <Td fixed>
                <Button size="s">Button</Button>
              </Td>
            </tr>
            <tr>
              <Td>株式会社SmartHR</Td>
              <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>
                multi
                <br />
                line
              </Td>
              <Td fixed>
                <Button size="s">Button</Button>
              </Td>
            </tr>
            <tr>
              <Td>株式会社SmartHR</Td>
              <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>
                multi
                <br />
                line
              </Td>
              <Td fixed>
                <Button size="s">Button</Button>
              </Td>
            </tr>
            <tr>
              <Td>株式会社SmartHR</Td>
              <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>
                multi
                <br />
                line
              </Td>
              <Td fixed>
                <Button size="s">Button</Button>
              </Td>
            </tr>
            <tr>
              <Td>株式会社SmartHR</Td>
              <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>
                multi
                <br />
                line
              </Td>
              <Td fixed>
                <Button size="s">Button</Button>
              </Td>
            </tr>
          </tbody>
        </Table>
      </TableReel>
    </li>
    <li>
      BaseにTableReelを入れる
      <Base overflow="auto">
        <TableReel>
          <Table>
            <thead>
              <tr>
                <Th>cell</Th>
                <Th>cell</Th>
                <Th>cell</Th>
                <Th>cell</Th>
                <Th>cell</Th>
                <Th>
                  multi
                  <br />
                  line
                </Th>
                <Th fixed>cell</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>株式会社SmartHR</Td>
                <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>
                  multi
                  <br />
                  line
                </Td>
                <Td fixed>
                  <Button size="s">Button</Button>
                </Td>
              </tr>
              <tr>
                <Td>株式会社SmartHR</Td>
                <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>
                  multi
                  <br />
                  line
                </Td>
                <Td fixed>
                  <Button size="s">Button</Button>
                </Td>
              </tr>
              <tr>
                <Td>株式会社SmartHR</Td>
                <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>
                  multi
                  <br />
                  line
                </Td>
                <Td fixed>
                  <Button size="s">Button</Button>
                </Td>
              </tr>
              <tr>
                <Td>株式会社SmartHR</Td>
                <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>
                  multi
                  <br />
                  line
                </Td>
                <Td fixed>
                  <Button size="s">Button</Button>
                </Td>
              </tr>
              <tr>
                <Td>株式会社SmartHR</Td>
                <Td>プロダクトエンジニアグループ/XXXXXXユニット</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>cell</Td>
                <Td>
                  multi
                  <br />
                  line
                </Td>
                <Td fixed>
                  <Button size="s">Button</Button>
                </Td>
              </tr>
            </tbody>
          </Table>
        </TableReel>
      </Base>
    </li>
  </Ul>
)
WithReel.storyName = 'with TableReel'

const Ul = styled.ul`
  list-style: none;
  padding: 0;

  > li {
    margin-top: 2rem;
    padding: 0 2rem;
  }
`
