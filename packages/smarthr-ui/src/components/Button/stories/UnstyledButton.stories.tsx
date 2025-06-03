import { UnstyledButton } from '../UnstyledButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/UnstyledButton',
  component: UnstyledButton,
  render: ({ children, ...args }) => (
    <UnstyledButton {...args}>{children || 'ボタン'}</UnstyledButton>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof UnstyledButton>

export const Playground: StoryObj<typeof UnstyledButton> = {
  name: 'Playground',
}
