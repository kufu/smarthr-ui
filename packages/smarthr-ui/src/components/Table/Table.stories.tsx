import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Base } from '../Base'
import { Button } from '../Button'
import { Cluster } from '../Layout'
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

const employeeData = [
  {
    employeeNo: 'SMP001',
    name: '須磨英知',
    divisionName:
      'table の幅計算は UA に依って仕様が異なるため、幅の指定は最小限にすることをおすすめします。',
    date: '2024-06-29',
    amount: '999,999円',
  },
  {
    employeeNo: 'SMP002',
    name: '須磨叡智郎',
    divisionName:
      'Th や Td の contentWidth に number か string を与えると width に反映されます。number は文字数 string は任意の値を指定できます。',
    date: '2024-06-29',
    amount: '999,999円',
  },
  {
    employeeNo: 'SMP003',
    name: '須磨端央',
    divisionName:
      'Td の contentWidth には { base: number | string, min: number | string, max: number | string } という object を与えられます。base は width に、min / max はそれぞれ min-width / max-width に対応します。',
    date: '2024-06-29',
    amount: '999,999円',
  },
  {
    employeeNo: 'SMP004',
    name: '須磨英千尋',
    divisionName:
      '社員番号や日付、操作列など、絶対に改行させたくない場合は Text[whitespace="nowrap"] を使ってください。合わせて contentWidth に 1px など小さい値を与えると、内包要素の最大幅で列幅が固定されます。',
    date: '2024-06-29',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR001',
    name: '田中 太郎',
    divisionName: '経営企画部/マーケティング部/デジタルマーケティング課/ソーシャルメディアチーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR002',
    name: '鈴木 花子',
    divisionName: '営業部/国内営業部/西日本営業課/大阪支店/法人営業チーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR003',
    name: '佐藤 健一',
    divisionName: '研究開発部/製品開発部/新製品開発課/プロジェクト管理チーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR004',
    name: '伊藤 美咲',
    divisionName: '人事部/人事管理部/採用課/新卒採用チーム/東京オフィス',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR005',
    name: '渡辺 次郎',
    divisionName: 'IT部/システム開発部/インフラ部/ネットワーク課/セキュリティチーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR006',
    name: 'ジョナサン・アレハンドロ・マルティネス・サンチェス',
    divisionName: '総務部/総務課/オフィスマネジメントチーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR007',
    name: 'アレクサンドラ・マリー・アンジェリーナ・ド・ソウザ',
    divisionName: '財務部/経理部/財務管理課/支払チーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR008',
    name: 'マイケル・フランシス・ジョンソン・ウィリアムズ',
    divisionName: '法務部/契約管理部/コンプライアンス課',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR009',
    name: 'カタリーナ・エリザベス・ロドリゲス・ガルシア',
    divisionName: '営業部/国際営業部/アジア営業課/中国支店',
    date: '2021-04-01',
    amount: '999,999円',
  },
  {
    employeeNo: 'SHR010',
    name: 'クリスティーナ・マリー・アンジェラ・マクドナルド',
    divisionName: '研究開発部/技術開発部/AI技術課/データサイエンステーム',
    date: '2021-04-01',
    amount: '999,999円',
  },
]

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

export const All: StoryFn = () => (
  <Ul>
    <li>
      <Table>
        <thead>
          <tr>
            <ThCheckbox name="tableAllCheckbox" />
            <Th sort="desc" onSort={action('昇順に並び替え')}>
              <Text whiteSpace="nowrap">社員番号</Text>
            </Th>
            <Th>氏名</Th>
            <Th>部署</Th>
            <Th sort="none" onSort={action('昇順に並び替え')}>
              申請日
            </Th>
            <Th align="right">総額</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map(({ employeeNo, name, divisionName, date, amount }, i) => (
            <tr key={employeeNo}>
              <TdCheckbox name={`tableCheckbox-${i}`} aria-labelledby={`name-${employeeNo}`} />
              <Td contentWidth="1px">
                <Text whiteSpace="nowrap">{employeeNo}</Text>
              </Td>
              <Td contentWidth={{ min: 10, max: 20 }} id={`name-${employeeNo}`}>
                {name}
              </Td>
              <Td contentWidth={{ min: 15, max: 30 }}>{divisionName}</Td>
              <Td contentWidth="1px">
                <Text whiteSpace="nowrap">{date}</Text>
              </Td>
              <Td align="right">{amount}</Td>
              <Td contentWidth="1px">
                <Cluster style={{ flexWrap: 'nowrap' }}>
                  <Button size="s">編集</Button>
                  <Button size="s">削除</Button>
                </Cluster>
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

export const WithReel: StoryFn = () => (
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
              <Th fixed data-test="fixed-cell">
                cell
              </Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td data-test="dynamic-change-text">株式会社SmartHR</Td>
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

export const FixedColumns = () => (
  <Ul>
    <li>
      <TableReel>
        <Table>
          <thead>
            <tr>
              <Th fixed>fixed</Th>
              <Th fixed>fixed</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th>cell</Th>
              <Th fixed>fixed</Th>
              <Th fixed>fixed</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td fixed>fixed</Td>
              <Td fixed>fixed</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td fixed>fixed</Td>
              <Td fixed>fixed</Td>
            </tr>
            <tr>
              <Td fixed>fixed</Td>
              <Td fixed>fixed</Td>
              <Td fixed>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td>cell</Td>
              <Td fixed>fixed</Td>
              <Td fixed>
                <FFButton />
              </Td>
            </tr>
          </tbody>
        </Table>
      </TableReel>
    </li>
  </Ul>
)

const FFButton = () => {
  const [state, setState] = React.useState(false)
  return (
    <Button size="s" variant="secondary" onClick={() => setState((s) => !s)}>
      {state ? 'Onnnnnnnnnnnnnnnnnnnn' : 'Off'}
    </Button>
  )
}

const Ul = styled.ul`
  list-style: none;
  padding: 0;

  > li {
    margin-top: 2rem;
    padding: 0 2rem;
  }
`
