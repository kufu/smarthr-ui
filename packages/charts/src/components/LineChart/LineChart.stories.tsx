import { LineChart } from './LineChart'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const meta: Meta<typeof LineChart> = {
  title: 'LineChart',
  component: LineChart,
  decorators: [
    (Story) => (
      <div className="shr-h-[500px]">
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof LineChart>

const sampleData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '売上',
      data: [12, 19, 3, 5, 2, 3],
    },
  ],
}

const multiDatasetData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '売上',
      data: [12, 19, 3, 5, 2, 3],
    },
    {
      label: '利益',
      data: [2, 3, 20, 5, 1, 4],
    },
  ],
}

export const Default: Story = {
  args: {
    data: sampleData,
    title: '線グラフ',
  },
}

export const MultipleDatasets: Story = {
  args: {
    data: multiDatasetData,
    title: '複数データの線グラフ',
  },
}

export const WithCustomOptions: Story = {
  args: {
    data: {
      labels: [
        'レベル1',
        'レベル2',
        'レベル3',
        'レベル3',
        'レベル3',
        'レベル3',
        'レベル3',
        'レベル3',
        'レベル3',
        'レベル4',
        'レベル5',
      ],
      datasets: [
        {
          label: '人数',
          data: [95, 48, 138, 138, 138, 138, 138, 138, 138, 88, 42],
        },
      ],
    },
    title: 'レベル分布',
    options: {
      scales: {
        y: {
          ticks: {
            stepSize: 50,
          },
          suggestedMax: 150,
        },
      },
    },
  },
}

export const WithDataLabels: Story = {
  args: {
    data: sampleData,
    title: 'データラベル付き線グラフ',
    options: {
      plugins: {
        datalabels: {
          display: true,
          backgroundColor: '#fff',
          borderColor: '#333',
          borderWidth: 1,
          borderRadius: 4,
          color: '#333',
          font: {
            weight: 'bold',
            size: 12,
          },
          padding: 4,
        },
      },
    },
  },
}

export const WithoutTitle: Story = {
  args: {
    data: sampleData,
  },
}

export const WithOverriddenTooltipAttempt: Story = {
  name: 'Tooltip上書き試行（内部設定が保護される）',
  args: {
    data: sampleData,
    title: 'Tooltip上書きテスト',
    options: {
      plugins: {
        tooltip: {
          // これらの設定は無視され、内部のスタイルが使われる
          backgroundColor: '#ff0000',
          titleColor: '#00ff00',
          bodyColor: '#0000ff',
          borderColor: '#ff00ff',
          borderWidth: 10,
          cornerRadius: 20,
        },
      },
    },
  },
}
