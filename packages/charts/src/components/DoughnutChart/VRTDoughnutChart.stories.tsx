import { Text } from 'smarthr-ui'

// eslint-disable-next-line smarthr/require-barrel-import
import { Stack } from '../../../../smarthr-ui/src/components/Layout'
import { doughnutSingleSegment, doughnutSmall, doughnutWithZero } from '../__stories__/testData'

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

      {/* パターン5: セグメント1つ（境界のボーダーが切れ込みにならないこと） */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSingleSegment} title="セグメント1つ" />
      </div>

      {/* パターン6: 値0のセグメントを含む（ボーダーだけが残らないこと） */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutWithZero} title="値0を含む" />
      </div>

      {/* パターン7: 中央コンテンツあり（タイトルなし＝凡例分だけ上にずれる） */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSmall}>
          <Text size="XXL" weight="bold">
            1,200人
          </Text>
          <Text size="S" color="TEXT_GREY">
            雇用形態の内訳
          </Text>
        </DoughnutChart>
      </div>

      {/* パターン8: 中央コンテンツあり＋タイトルあり（タイトル分もずれること） */}
      <div className="shr-h-[400px]">
        <DoughnutChart data={doughnutSmall} title="雇用形態の内訳">
          <Text size="XXL" weight="bold">
            1,200人
          </Text>
        </DoughnutChart>
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
