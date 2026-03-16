import { UnstyledButton } from '../UnstyledButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

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
