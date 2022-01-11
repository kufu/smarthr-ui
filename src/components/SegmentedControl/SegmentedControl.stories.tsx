import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { Option, SegmentedControl } from './SegmentedControl'
import {
  FaChartAreaIcon,
  FaChartBarIcon,
  FaChartLineIcon,
  FaChartPieIcon,
  FaTableIcon,
} from '../Icon'

import readme from './README.md'

storiesOf('SegmentedControl', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const departmentAndCrewOptions: Option[] = [
      { value: 'departments', content: '部署' },
      { value: 'crews', content: '従業員' },
      { value: 'both', content: '部署と従業員' },
    ]
    const graphOptions: Option[] = [
      { value: 'table', ariaLabel: 'テーブル', content: <FaTableIcon /> },
      { value: 'chartBar', ariaLabel: 'バーチャート', content: <FaChartBarIcon /> },
      { value: 'chartArea', ariaLabel: 'エリアチャート', content: <FaChartAreaIcon /> },
      { value: 'chartLine', ariaLabel: 'ラインチャート', content: <FaChartLineIcon /> },
      { value: 'chartPie', ariaLabel: 'パイチャート', content: <FaChartPieIcon /> },
    ]

    const [value1, setValue1] = React.useState<string | null>('departments')
    const [value2, setValue2] = React.useState<string | null>('both')
    const [value3, setValue3] = React.useState<string | null>('chartArea')
    const [value4, setValue4] = React.useState<string | null>(null)
    const [value5, setValue5] = React.useState<string | null>(null)

    return (
      <List>
        <dt id="dt-default">Default</dt>
        <dd>
          <SegmentedControl
            options={departmentAndCrewOptions}
            value={value1}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue1(value)
            }}
            aria-labelledby="dt-default"
          />
        </dd>
        <dt id="dt-small">Small</dt>
        <dd>
          <SegmentedControl
            options={departmentAndCrewOptions}
            value={value2}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue2(value)
            }}
            size="s"
            aria-labelledby="dt-small"
          />
        </dd>
        <dt id="dt-icon">Icon</dt>
        <dd>
          <SegmentedControl
            options={graphOptions}
            value={value3}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue3(value)
            }}
            isSquare
            aria-labelledby="dt-icon"
          />
        </dd>
        <dt id="dt-small-icon">Small icon</dt>
        <dd>
          <SegmentedControl
            options={graphOptions}
            value={value4}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue4(value)
            }}
            size="s"
            isSquare
            aria-labelledby="dt-small-icon"
          />
        </dd>
        <dt id="dt-disabled">Disabled</dt>
        <dd>
          <SegmentedControl
            options={graphOptions.map((option, i) => ({
              ...option,
              disabled: i === 2 || i === 4,
            }))}
            value={value5}
            onClickOption={(value) => {
              action('clicked')(value)
              setValue5(value)
            }}
            aria-labelledby="dt-disabled"
          />
        </dd>
      </List>
    )
  })

const List = styled.dl`
  padding: 1rem;
  margin: 0;

  dt {
    margin-bottom: 0.5rem;
  }
  dd {
    margin-left: 0;
    margin-bottom: 1rem;
  }
`
