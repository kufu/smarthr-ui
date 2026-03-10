import { chartJsOptionsExamples, multiSmall, singleSmall } from '../__stories__/testData'

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
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export default meta
type Story = StoryObj<typeof Chart>

export const Playground: Story = {
  args: {
    type: 'bar',
    title: 'Chart',
    data: singleSmall,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['bar', 'line'],
    },
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

export const Type: Story = {
  name: 'type',
  args: {
    type: 'bar',
    data: singleSmall,
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['bar', 'line'],
    },
  },
}

export const Title: Story = {
  name: 'title',
  args: {
    type: 'bar',
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
    type: 'bar',
    data: {
      labels: ['A', 'B', 'C', 'D', 'E'],
      datasets: [
        {
          label: 'データ',
          data: [95, 48, 80, 70, 42],
        },
      ],
    },
    options: chartJsOptionsExamples.comprehensive,
  },
}
