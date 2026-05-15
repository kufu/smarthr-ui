import { radarMultiSmall, radarSingleSmall } from '../__stories__/testData'

import { RadarChart } from './RadarChart'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof RadarChart> = {
  title: 'Charts/RadarChart',
  component: RadarChart,
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

type Story = StoryObj<typeof RadarChart>

export const Playground: Story = {
  args: {
    data: radarSingleSmall,
    title: 'Radar Chart',
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
    data: radarSingleSmall,
  },
}

export const MultipleDatasets: Story = {
  args: {
    data: radarMultiSmall,
  },
}

export const Title: Story = {
  name: 'title',
  args: {
    data: radarSingleSmall,
    title: 'Title',
  },
  argTypes: {
    title: {
      control: 'text',
    },
  },
}

export const WithCustomRScale: Story = {
  name: 'with custom r scale',
  args: {
    data: radarMultiSmall,
    title: 'カスタムスケール',
    options: {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
          },
        },
      },
    },
  },
}
