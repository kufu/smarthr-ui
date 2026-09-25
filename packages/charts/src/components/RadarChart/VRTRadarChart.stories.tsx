// eslint-disable-next-line smarthr/require-barrel-import
import { Stack } from '../../../../smarthr-ui/src/components/Layout'
import {
  chartJsOptionsExamples,
  radarManyAxes,
  radarMultiSmall,
  radarSingleSmall,
} from '../__stories__/testData'

import { RadarChart } from './RadarChart'

export default {
  title: 'Charts/RadarChart/VRT',
  render: (args) => (
    <Stack {...args}>
      {/* パターン1: 単一データセット、タイトルなし */}
      <div className="shr-h-[400px]">
        <RadarChart data={radarSingleSmall} />
      </div>

      {/* パターン2: 単一データセット、タイトルあり */}
      <div className="shr-h-[400px]">
        <RadarChart data={radarSingleSmall} title="単一データセット" />
      </div>

      {/* パターン3: 複数データセット(3個)、タイトルあり */}
      <div className="shr-h-[400px]">
        <RadarChart data={radarMultiSmall} title="複数データセット" />
      </div>

      {/* パターン4: 複数データセット(3個)、タイトルなし */}
      <div className="shr-h-[400px]">
        <RadarChart data={radarMultiSmall} />
      </div>

      {/* パターン5: データラベル付き */}
      <div className="shr-h-[400px]">
        <RadarChart
          data={radarSingleSmall}
          title="データラベル付き"
          options={chartJsOptionsExamples.datalabelsWithBorder}
        />
      </div>

      {/* パターン6: 小サイズ(300px) */}
      <div className="shr-h-[300px]">
        <RadarChart data={radarSingleSmall} title="小サイズ" />
      </div>

      {/* パターン7: 多軸(8軸)、複数データセット(2個) */}
      <div className="shr-h-[400px]">
        <RadarChart data={radarManyAxes} title="多軸" />
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
