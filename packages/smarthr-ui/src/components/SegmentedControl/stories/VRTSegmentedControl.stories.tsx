import { fireEvent, userEvent, within } from '@storybook/test'

import { FaChartAreaIcon, FaChartBarIcon, FaChartLineIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Option, SegmentedControl } from '../SegmentedControl'

import type { StoryObj } from '@storybook/react'

const chartBarIcon = <FaChartBarIcon />
const chartAreaIcon = <FaChartAreaIcon />
const chartLineIcon = <FaChartLineIcon />

const textOptions = (disabled: boolean): Option[] => [
  { value: '1', content: '部署', disabled },
  { value: '2', content: '従業員', disabled },
  { value: '3', content: '部署と従業員', disabled },
]

const iconOptions = (disabled: boolean): Option[] => [
  { value: '1', content: chartBarIcon, disabled },
  { value: '2', content: chartAreaIcon, disabled },
  { value: '3', content: chartLineIcon, disabled },
]

export default {
  title: 'Buttons（ボタン）/SegmentedControl/VRT',
  /* ペアワイズ法による網羅 */
  // options.content options.disabled        value   size
  // icon            true                    null    default
  // text            false                   null    s
  // text            true                    3       s
  // text            false                   1       default
  // icon            false                   3       default
  // icon            true                    1       s
  // icon            false                   1       s
  render: (args: any) => (
    <Stack>
      <SegmentedControl options={iconOptions(true)} value={null} size="default" />
      <SegmentedControl options={textOptions(false)} value={null} size="s" />
      <SegmentedControl options={textOptions(true)} value="3" size="s" />
      <SegmentedControl options={textOptions(false)} value="1" size="default" />
      <SegmentedControl options={iconOptions(false)} value="3" size="default" />
      <SegmentedControl options={iconOptions(true)} value="1" size="s" />
      <SegmentedControl options={iconOptions(false)} value="1" size="s" />
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
}

export const VRT = {}

export const VRTHover = {
  ...VRT,
  args: {
    id: 'hover',
  },
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-SegmentedControl'],
    },
    // MEMO: VRT として機能していないので、解決するまでスナップショットを無効化
    chromatic: { disableSnapshot: true },
  },
}

export const VRTKeyboardFocus: StoryObj = {
  ...VRT,
  play: async () => {
    userEvent.tab()
    userEvent.tab()
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
