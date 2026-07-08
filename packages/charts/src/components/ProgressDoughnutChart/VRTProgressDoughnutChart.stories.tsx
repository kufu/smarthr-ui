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
          title="インストール率"
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
          title="進捗ゼロ"
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
          title="完了"
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
          title="太さM"
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
          title="ラベルのみ"
          thickness="L"
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
