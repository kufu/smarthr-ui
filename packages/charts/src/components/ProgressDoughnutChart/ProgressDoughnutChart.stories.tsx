import { Text } from 'smarthr-ui'

import { ProgressDoughnutChart } from './ProgressDoughnutChart'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof ProgressDoughnutChart> = {
  title: 'Charts/ProgressDoughnutChart',
  component: ProgressDoughnutChart,
  decorators: [
    (Story) => (
      <div className="shr-h-[300px] shr-w-[300px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

export default meta

type Story = StoryObj<typeof ProgressDoughnutChart>

export const Playground: Story = {
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [780, 420] }],
    },
    title: 'インストール率',
    thickness: 'S',
    tone: 1,
    children: (
      <>
        <Text size="XXL" weight="bold">
          65%
        </Text>
        <Text size="S" color="TEXT_GREY">
          PROGRESS
        </Text>
      </>
    ),
  },
  argTypes: {
    data: { control: 'object' },
    title: { control: 'text' },
    thickness: { control: 'radio', options: ['S', 'M', 'L'] },
    tone: { control: { type: 'range', min: 0, max: 5 } },
  },
}

export const Default: Story = {
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [780, 420] }],
    },
    title: 'インストール率',
  },
}

export const WithCenterContent: Story = {
  name: 'with center content',
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [780, 420] }],
    },
    title: 'インストール率',
    children: (
      <>
        <Text size="XXL" weight="bold">
          65%
        </Text>
        <Text size="S" color="TEXT_GREY">
          PROGRESS
        </Text>
      </>
    ),
  },
}
