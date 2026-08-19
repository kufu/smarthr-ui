import { Text } from 'smarthr-ui'

// eslint-disable-next-line smarthr/require-barrel-import
import { Stack } from '../../../../smarthr-ui/src/components/Layout'

import { ProgressDoughnutChart } from './ProgressDoughnutChart'

export default {
  title: 'Charts/ProgressDoughnutChart/VRT',
  render: (args: React.ComponentProps<typeof Stack>) => (
    <Stack {...args}>
      {/* パターン1: 中央テキストあり、太さS、65% */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['インストール済', '未インストール'], datasets: [{ data: [780, 420] }] }}
          thickness="S"
        >
          <Text size="XXL" weight="bold">
            65%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン2: 0% */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['完了', '未完了'], datasets: [{ data: [0, 100] }] }}
          thickness="S"
        >
          <Text size="XXL" weight="bold">
            0%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン3: 100% */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['完了', '未完了'], datasets: [{ data: [100, 0] }] }}
          thickness="S"
        >
          <Text size="XXL" weight="bold">
            100%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン4: 太さM、tone濃いめ、40% */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['進捗', '残り'], datasets: [{ data: [40, 60] }] }}
          thickness="M"
          tone={3}
        >
          <Text size="XXL" weight="bold">
            40%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン5: 中央コンテンツなし、太さL、75% */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['処理済', '未処理'], datasets: [{ data: [75, 25] }] }}
          thickness="L"
        />
      </div>

      {/* パターン6: 極小値（0.3%）。角端では帯の長さどおりに描かれる */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['インストール済', '未インストール'], datasets: [{ data: [30, 9970] }] }}
          thickness="S"
        >
          <Text size="XXL" weight="bold">
            0%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン7: 丸端、65% */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['インストール済', '未インストール'], datasets: [{ data: [780, 420] }] }}
          thickness="S"
          rounded
        >
          <Text size="XXL" weight="bold">
            65%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン8: 丸端かつ極小値。丸端が帯より大きな塊になる */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['インストール済', '未インストール'], datasets: [{ data: [30, 9970] }] }}
          thickness="S"
          rounded
        >
          <Text size="XXL" weight="bold">
            0%
          </Text>
        </ProgressDoughnutChart>
      </div>
      {/* パターン9: 母集団 0。トラックだけが満円で描かれる */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['インストール済', '未インストール'], datasets: [{ data: [0, 0] }] }}
          thickness="S"
        >
          <Text size="XXL" weight="bold">
            0%
          </Text>
        </ProgressDoughnutChart>
      </div>

      {/* パターン10: 丸端かつ母集団 0。角端と同じくトラックだけが描かれる */}
      <div className="shr-h-[300px] shr-w-[300px]">
        <ProgressDoughnutChart
          data={{ labels: ['インストール済', '未インストール'], datasets: [{ data: [0, 0] }] }}
          thickness="S"
          rounded
        >
          <Text size="XXL" weight="bold">
            0%
          </Text>
        </ProgressDoughnutChart>
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
