import { chartJsOptionsExamples, multiSmall, singleSmall } from '../__stories__/testData'

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
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export default meta

type Story = StoryObj<typeof LineChart>

export const Playground: Story = {
  args: {
    data: singleSmall,
    title: 'Line Chart',
  },
  argTypes: {
    data: {
      control: 'object',
    },
    title: {
      control: 'text',
    },
    options: {
      control: 'object',
    },
  },
}

export const Default: Story = {
  args: {
    data: singleSmall,
  },
}

export const MultipleDatasets: Story = {
  args: {
    data: multiSmall,
  },
}

export const Title: Story = {
  name: 'title',
  args: {
    data: singleSmall,
    title: 'Title',
  },
  argTypes: {
    title: {
      control: 'text',
    },
  },
}

export const WithChartJsOptions: Story = {
  name: 'with Chart.js options',
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
    options: {
      ...chartJsOptionsExamples.customScales,
      ...chartJsOptionsExamples.datalabelsWithBorder,
    },
  },
}
