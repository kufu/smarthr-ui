// eslint-disable-next-line smarthr/require-barrel-import
import { Stack } from '../../../../smarthr-ui/src/components/Layout'
import { doughnutSmall } from '../__stories__/testData'

import { DoughnutChart } from './DoughnutChart'

export default {
  title: 'Charts/DoughnutChart/VRT',
  render: (args: React.ComponentProps<typeof Stack>) => (
    <Stack {...args}>
      {/* パターン1: タイトルなし、標準太さ */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSmall} />
      </div>

      {/* パターン2: タイトルあり、標準太さ */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSmall} title="雇用形態の内訳" />
      </div>

      {/* パターン3: 太さS（細） */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSmall} thickness="S" title="太さS" />
      </div>

      {/* パターン4: 太さL（太） */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSmall} thickness="L" title="太さL" />
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
