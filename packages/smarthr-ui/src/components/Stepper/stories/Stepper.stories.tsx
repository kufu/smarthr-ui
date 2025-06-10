import type { Meta, StoryObj } from '@storybook/react'

import { Stepper } from '..'
import { Stack } from '../../Layout'

export default {
  title: 'Components/Stepper',
  component: Stepper,
  render: (args) => <Stepper {...args} />,
  args: {
    type: 'horizontal',
    steps: [{ label: 'ステップ1' }, { label: 'ステップ2' }, { label: 'ステップ3' }],
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Stepper>

export const Playground: StoryObj<typeof Stepper> = {}

export const Type: StoryObj<typeof Stepper> = {
  name: 'type',
  render: (args) => (
    <Stack>
      {['horizontal', 'vertical'].map((type) => (
        <Stepper key={type} {...args} type={type as any} />
      ))}
    </Stack>
  ),
}

const _steps = {
  horizontal: [
    { label: 'ステップ1', status: 'completed' },
    { label: 'ステップ2', status: { type: 'closed', text: '中断' } },
    { label: 'ステップ3' },
  ],
  vertical: [
    { label: 'ステップ1', status: 'completed', children: <div>ステップ1コンテンツ</div> },
    {
      label: 'ステップ2',
      status: { type: 'closed', text: '中断' },
      children: <div>ステップ2コンテンツ</div>,
    },
    { label: 'ステップ3', children: <div>ステップ3コンテンツ</div> },
  ],
}

export const Steps: StoryObj<typeof Stepper> = {
  name: 'steps',
  render: (args) => (
    <Stack>
      {['horizontal', 'vertical'].map((type) => (
        <Stepper
          key={type}
          {...args}
          type={type as any}
          steps={_steps[type as 'horizontal' | 'vertical'] as any}
        />
      ))}
    </Stack>
  ),
}

export const ActiveIndex: StoryObj<typeof Stepper> = {
  name: 'activeIndex',
  args: {
    activeIndex: 0,
  },
  render: (args) => (
    <Stack>
      {['horizontal', 'vertical'].map((type) => (
        <Stepper
          key={type}
          {...args}
          type={type as any}
          steps={_steps[type as 'horizontal' | 'vertical'] as any}
        />
      ))}
    </Stack>
  ),
}
