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
    thickness: 'S',
    tone: 1,
    rounded: false,
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
    thickness: { control: 'radio', options: ['S', 'M', 'L'] },
    tone: { control: { type: 'range', min: 1, max: 5, step: 1 } },
    rounded: { control: 'boolean' },
  },
}

export const Default: Story = {
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [780, 420] }],
    },
  },
}

export const WithCenterContent: Story = {
  name: 'with center content',
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [780, 420] }],
    },
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

export const Rounded: Story = {
  name: 'rounded',
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [780, 420] }],
    },
    rounded: true,
  },
}

export const TinyValue: Story = {
  name: 'with tiny value',
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [30, 9970] }],
    },
    children: (
      <Text size="XXL" weight="bold">
        0%
      </Text>
    ),
  },
}

export const RoundedTinyValue: Story = {
  name: 'rounded with tiny value',
  args: {
    ...TinyValue.args,
    rounded: true,
  },
}

export const Empty: Story = {
  name: 'with empty data',
  args: {
    data: {
      labels: ['インストール済', '未インストール'],
      datasets: [{ data: [0, 0] }],
    },
    children: (
      <Text size="XXL" weight="bold">
        0%
      </Text>
    ),
  },
}

export const RoundedEmpty: Story = {
  name: 'rounded with empty data',
  args: {
    ...Empty.args,
    rounded: true,
  },
}
