import { chartJsOptionsExamples, multiSmall, singleSmall } from '../__stories__/testData'

import { BarChart } from './BarChart'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TooltipItem } from 'chart.js'

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

const additionalData = {
  datasets: [
    {
      data: ['Aの補足情報', 'Bの補足情報', 'Cの補足情報', 'Dの補足情報', 'Eの補足情報'],
    },
  ],
}
export const WithTooltipCallbacks: Story = {
  name: 'with tooltip callbacks options',
  args: {
    data: singleSmall,
    options: {
      plugins: {
        tooltip: {
          titleColor: '#ED1A3D', // 保護しているプロパティの上書きができないことの検証
          callbacks: {
            label: function (context: TooltipItem<'bar'>) {
              // 本来表示するラベル
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              // 単位を付与する
              if (context.parsed.y !== null) {
                label += context.parsed.y + '人'
              }
              // 補足情報を追加する
              const additionalDataLabel =
                additionalData.datasets[context.datasetIndex].data[context.dataIndex]
              if (additionalDataLabel) {
                label += `（${additionalDataLabel}）`
              }

              return label
            },
          },
        },
      },
    },
  },
}
