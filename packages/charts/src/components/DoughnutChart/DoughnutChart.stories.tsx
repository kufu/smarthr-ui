import { doughnutSmall } from '../__stories__/testData'

import { DoughnutChart } from './DoughnutChart'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof DoughnutChart> = {
  title: 'Charts/DoughnutChart',
  component: DoughnutChart,
  decorators: [
    (Story) => (
      <div className="shr-h-[400px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export default meta

type Story = StoryObj<typeof DoughnutChart>

export const Playground: Story = {
  args: {
    data: doughnutSmall,
    title: 'Doughnut Chart',
    thickness: 'M',
  },
  argTypes: {
    data: { control: 'object' },
    title: { control: 'text' },
    thickness: { control: 'radio', options: ['S', 'M', 'L'] },
    options: { control: 'object' },
  },
}

export const Default: Story = {
  args: {
    data: doughnutSmall,
  },
}

export const Title: Story = {
  name: 'title',
  args: {
    data: doughnutSmall,
    title: '雇用形態の内訳',
  },
}
