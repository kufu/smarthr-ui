import { Stack } from '../../../../smarthr-ui/src/components/Layout'
import {
  chartJsOptionsExamples,
  manyPoints,
  multiSmall,
  singleSmall,
} from '../__stories__/testData'

import { BarChart } from './BarChart'

import type { StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'BarChart/VRT',
  render: (args: any) => (
    <Stack {...args}>
      {/* パターン1: 単一データセット、タイトルなし、ラベルなし、標準サイズ、少データ */}
      <div className="shr-h-[400px]">
        <BarChart data={singleSmall} />
      </div>

      {/* パターン2: 単一データセット、タイトルあり、ラベルなし、標準サイズ、少データ */}
      <div className="shr-h-[400px]">
        <BarChart data={singleSmall} title="単一データセット" />
      </div>

      {/* パターン3: 複数データセット(3個)、タイトルあり、ラベルなし、標準サイズ、少データ */}
      <div className="shr-h-[400px]">
        <BarChart data={multiSmall} title="複数データセット" />
      </div>

      {/* パターン4: 複数データセット(3個)、タイトルなし、ラベルなし、標準サイズ、少データ */}
      <div className="shr-h-[400px]">
        <BarChart data={multiSmall} />
      </div>

      {/* パターン5: 単一データセット、タイトルあり、ラベルあり、標準サイズ、少データ */}
      <div className="shr-h-[400px]">
        <BarChart
          data={singleSmall}
          title="データラベル付き"
          options={chartJsOptionsExamples.datalabels}
        />
      </div>

      {/* パターン6: 複数データセット(3個)、タイトルあり、ラベルあり、標準サイズ、少データ */}
      <div className="shr-h-[400px]">
        <BarChart
          data={multiSmall}
          title="複数データ・ラベル付き"
          options={chartJsOptionsExamples.datalabels}
        />
      </div>

      {/* パターン7: 単一データセット、タイトルあり、ラベルなし、小サイズ(300px)、少データ */}
      <div className="shr-h-[300px]">
        <BarChart data={singleSmall} title="小サイズ" />
      </div>

      {/* パターン8: 複数データセット(3個)、タイトルあり、ラベルなし、標準サイズ、多データ(12個) */}
      <div className="shr-h-[400px]">
        <BarChart data={manyPoints} title="多データポイント" />
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
