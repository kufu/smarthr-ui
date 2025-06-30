import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './BarChart'

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  decorators: [
    (Story) => (
      <div style={{ height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof BarChart>

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
    title: '棒グラフ',
  },
}

export const MultipleDatasets: Story = {
  args: {
    data: multiDatasetData,
    title: '複数データの棒グラフ',
  },
}
