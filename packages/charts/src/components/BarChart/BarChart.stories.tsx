import { chartJsOptionsExamples, multiSmall, singleSmall } from '../__stories__/testData'

import { BarChart } from './BarChart'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
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

type Story = StoryObj<typeof BarChart>

export const Playground: Story = {
  args: {
    data: singleSmall,
    title: 'Bar Chart',
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
    options: chartJsOptionsExamples.comprehensive,
  },
}

export const WithAnnotations: Story = {
  name: 'with chartjs-plugin-annotation options',
  args: {
    data: singleSmall,
    options: {
      plugins: {
        annotation: {
          annotations: {
            average: {
              type: 'line',
              yMin: 10,
              yMax: 10,
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 2,
            },
          },
        },
      },
    },
  },
}
