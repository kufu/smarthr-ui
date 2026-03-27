import { Stack } from '../../../../smarthr-ui/src/components/Layout'
import { multiSmall, singleSmall } from '../__stories__/testData'

import { Chart } from './Chart'

import type { StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Chart/VRT',
  render: (args: any) => (
    <Stack {...args}>
      {/* Bar型 パターン1: 単一データセット、タイトルあり、標準サイズ */}
      <div className="shr-h-[400px]">
        <Chart type="bar" data={singleSmall} title="Bar型 - 単一データセット" />
      </div>

      {/* Bar型 パターン2: 複数データセット(3個)、タイトルあり、標準サイズ */}
      <div className="shr-h-[400px]">
        <Chart type="bar" data={multiSmall} title="Bar型 - 複数データセット" />
      </div>

      {/* Line型 パターン3: 単一データセット、タイトルあり、標準サイズ */}
      <div className="shr-h-[400px]">
        <Chart type="line" data={singleSmall} title="Line型 - 単一データセット" />
      </div>

      {/* Line型 パターン4: 複数データセット(3個)、タイトルあり、標準サイズ */}
      <div className="shr-h-[400px]">
        <Chart type="line" data={multiSmall} title="Line型 - 複数データセット" />
      </div>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
