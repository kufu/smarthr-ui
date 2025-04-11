import { action } from '@storybook/addon-actions'
import { BottomPanel } from '../BottomPanel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/BottomPanel',
  component: BottomPanel,
  render: (args) => <BottomPanel>BottomPanel Children.</BottomPanel>,
  argTypes: {},
  args: {},
  parameters: {
    docs: {
      story: {
        height: '200px',
      },
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof BottomPanel>

export const Playground: StoryObj<typeof BottomPanel> = {
  args: {},
}

export const ZIndex: StoryObj<typeof BottomPanel> = {
  name: 'zIndex',
  args: {
    zIndex: 1,
  },
}
