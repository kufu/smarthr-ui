import { Chart } from './Chart'

import type { Meta, StoryObj } from '@storybook/react-webpack5'


const meta: Meta<typeof Chart> = {
  title: 'Chart',
  component: Chart,
  decorators: [
    (Story) => (
      <div style={{ height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Chart>

export const BarChart: Story = {
  args: {
    type: 'bar',
    title: 'サンプル棒グラフ',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '売上',
          data: [65, 59, 80, 81, 56],
        },
      ],
    },
  },
}

export const MultipleDatasets: Story = {
  args: {
    type: 'bar',
    title: '部門別売上比較',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '部門A',
          data: [65, 59, 80, 81, 56],
        },
        {
          label: '部門B',
          data: [45, 70, 65, 75, 60],
        },
      ],
    },
  },
}

export const LineChart: Story = {
  args: {
    type: 'line',
    title: 'サンプル線グラフ',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '売上',
          data: [65, 59, 80, 81, 56],
        },
      ],
    },
  },
}

export const ManyDatasetsBar: Story = {
  args: {
    type: 'bar',
    title: '多データセット棒グラフサンプル',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'データA',
          data: [20, 35, 40, 30],
        },
        {
          label: 'データB',
          data: [25, 30, 35, 45],
        },
        {
          label: 'データC',
          data: [15, 25, 30, 35],
        },
        {
          label: 'データD',
          data: [30, 40, 25, 20],
        },
        {
          label: 'データE',
          data: [35, 20, 45, 40],
        },
        {
          label: 'データF',
          data: [10, 15, 20, 25],
        },
        {
          label: 'データG',
          data: [45, 50, 35, 30],
        },
        {
          label: 'データH',
          data: [25, 45, 30, 35],
        },
        {
          label: 'データI',
          data: [40, 25, 50, 45],
        },
        {
          label: 'データJ',
          data: [20, 30, 25, 40],
        },
      ],
    },
  },
}

export const ManyDatasetsLine: Story = {
  args: {
    type: 'line',
    title: '多データセット線グラフサンプル',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: 'データA',
          data: [10, 20, 15, 25, 30, 35],
        },
        {
          label: 'データB',
          data: [15, 25, 20, 30, 25, 40],
        },
        {
          label: 'データC',
          data: [20, 15, 30, 20, 35, 25],
        },
        {
          label: 'データD',
          data: [25, 30, 25, 35, 20, 30],
        },
        {
          label: 'データE',
          data: [30, 25, 35, 30, 40, 35],
        },
        {
          label: 'データF',
          data: [5, 10, 15, 10, 20, 15],
        },
        {
          label: 'データG',
          data: [35, 40, 30, 45, 35, 50],
        },
        {
          label: 'データH',
          data: [40, 35, 45, 40, 50, 45],
        },
        {
          label: 'データI',
          data: [45, 50, 40, 55, 45, 60],
        },
        {
          label: 'データJ',
          data: [12, 18, 22, 16, 28, 24],
        },
      ],
    },
  },
}

export const BarChartWithDataLabels: Story = {
  args: {
    type: 'bar',
    title: 'データラベル付き棒グラフ',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '売上',
          data: [65, 59, 80, 81, 56],
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'end',
          color: '#333',
          font: {
            weight: 'bold',
            size: 12,
          },
        },
      },
    },
  },
}

export const LineChartWithDataLabels: Story = {
  args: {
    type: 'line',
    title: 'データラベル付き線グラフ',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '売上',
          data: [65, 59, 80, 81, 56],
        },
      ],
    },
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

export const BarChartWithoutTitle: Story = {
  args: {
    type: 'bar',
    data: {
      labels: ['1月', '2月', '3月', '4月', '5月'],
      datasets: [
        {
          label: '売上',
          data: [65, 59, 80, 81, 56],
        },
      ],
    },
  },
}
