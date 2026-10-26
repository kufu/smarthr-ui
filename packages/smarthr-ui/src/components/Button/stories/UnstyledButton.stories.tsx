import { UnstyledButton } from '../UnstyledButton'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Button/UnstyledButton',
  component: UnstyledButton,
  render: ({ children, ...rest }) => (
    <UnstyledButton {...rest}>{children || 'ボタン'}</UnstyledButton>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof UnstyledButton>

export const Playground: StoryObj<typeof UnstyledButton> = {}
