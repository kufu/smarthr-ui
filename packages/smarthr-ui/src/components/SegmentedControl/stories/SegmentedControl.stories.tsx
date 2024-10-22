import { action } from '@storybook/addon-actions'
import React from 'react'

import {
  FaChartAreaIcon,
  FaChartBarIcon,
  FaChartLineIcon,
  FaChartPieIcon,
  FaTableIcon,
} from '../../Icon'
import { Stack } from '../../Layout'
import { SegmentedControl } from '../SegmentedControl'

import type { Meta, StoryObj } from '@storybook/react'

const tableIcon = <FaTableIcon />
const chartBarIcon = <FaChartBarIcon />
const chartAreaIcon = <FaChartAreaIcon />
const chartLineIcon = <FaChartLineIcon />
const chartPieIcon = <FaChartPieIcon />

export default {
  title: 'Buttons（ボタン）/SegmentedControl',
  component: SegmentedControl,
  render: (args) => <SegmentedControl {...args} />,
  args: {
    options: [
      { value: 'departments', content: '部署' },
      { value: 'crew', content: '従業員' },
      { value: 'both', content: '部署と従業員' },
    ],
    value: 'departments',
    onClickOption: (value) => action('onClickOption')(value),
    size: 'default',
    isSquare: false,
    className: '',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SegmentedControl>

export const SegmentedControlControl: StoryObj<typeof SegmentedControl> = {
  name: 'Playground',
  args: {},
}

export const Options: StoryObj<typeof SegmentedControl> = {
  name: 'options',
  render: (args) => (
    <Stack>
      <SegmentedControl
        {...args}
        options={[
          { value: 'departments', content: '部署' },
          { value: 'crew', content: '従業員' },
          { value: 'both', content: '部署と従業員' },
        ]}
      />
      <SegmentedControl
        {...args}
        options={[
          { value: 'departments', content: '部署', disabled: true },
          { value: 'crew', content: '従業員', disabled: true },
          { value: 'both', content: '部署と従業員', disabled: true },
        ]}
      />
      <SegmentedControl
        {...args}
        isSquare={true}
        options={[
          { value: 'table', ariaLabel: 'テーブル', content: tableIcon },
          { value: 'chartBar', ariaLabel: 'バーチャート', content: chartBarIcon },
          { value: 'chartArea', ariaLabel: 'エリアチャート', content: chartAreaIcon },
          { value: 'chartLine', ariaLabel: 'ラインチャート', content: chartLineIcon },
          { value: 'chartPie', ariaLabel: 'パイチャート', content: chartPieIcon },
        ]}
      />
    </Stack>
  ),
}

export const Value: StoryObj<typeof SegmentedControl> = {
  name: 'value',
  render: (args) => (
    <Stack>
      <SegmentedControl {...args} value={null} />
      <SegmentedControl {...args} value="departments" />
      <SegmentedControl {...args} value="crew" />
      <SegmentedControl {...args} value="both" />
    </Stack>
  ),
}

export const Size: StoryObj<typeof SegmentedControl> = {
  name: 'size',
  render: (args) => (
    <Stack>
      <SegmentedControl {...args} size="default" />
      <SegmentedControl {...args} size="s" />
    </Stack>
  ),
}

export const IsSquare: StoryObj<typeof SegmentedControl> = {
  name: 'isSquare',
  render: (args) => (
    <Stack>
      <SegmentedControl
        {...args}
        options={[
          { value: 'table', ariaLabel: 'テーブル', content: tableIcon },
          { value: 'chartBar', ariaLabel: 'バーチャート', content: chartBarIcon },
          { value: 'chartArea', ariaLabel: 'エリアチャート', content: chartAreaIcon },
          { value: 'chartLine', ariaLabel: 'ラインチャート', content: chartLineIcon },
          { value: 'chartPie', ariaLabel: 'パイチャート', content: chartPieIcon },
        ]}
        isSquare={false}
      />
      <SegmentedControl
        {...args}
        options={[
          { value: 'departments', content: '部署', disabled: true },
          { value: 'crew', content: '従業員', disabled: true },
          { value: 'both', content: '部署と従業員', disabled: true },
        ]}
        isSquare={true}
      />
    </Stack>
  ),
}
