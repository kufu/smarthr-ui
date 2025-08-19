import { Meta, StoryObj } from '@storybook/react'
import { Chart } from './Chart'

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
