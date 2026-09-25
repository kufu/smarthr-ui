// eslint-disable-next-line smarthr/require-barrel-import
import { Stack } from '../../../../smarthr-ui/src/components/Layout'
import {
  chartJsOptionsExamples,
  manyPoints,
  multiSmall,
  singleSmall,
} from '../__stories__/testData'

import { BarChart } from './BarChart'

export default {
  title: 'Charts/BarChart/VRT',
  render: (args) => (
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

      {/* パターン9: chartjs-plugin-annotation options */}
      <div className="shr-h-[400px]">
        <BarChart
          data={singleSmall}
          title="chartjs-plugin-annotation options"
          options={{
            plugins: {
              annotation: {
                annotations: {
                  average: {
                    type: 'line',
                    yMin: 10,
                    yMax: 10,
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                  },
                },
              },
            },
          }}
        />
      </div>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
