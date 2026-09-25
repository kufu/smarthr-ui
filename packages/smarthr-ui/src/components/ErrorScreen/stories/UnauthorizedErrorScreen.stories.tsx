import { UnauthorizedErrorScreen } from '../UnauthorizedErrorScreen'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/ErrorScreen/UnauthorizedErrorScreen',
  component: UnauthorizedErrorScreen,
  render: (args) => <UnauthorizedErrorScreen {...args} />,
  args: {
    onClickLogin: () => console.log('Login clicked'),
    isLoading: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof UnauthorizedErrorScreen>

export const Playground: StoryObj<typeof UnauthorizedErrorScreen> = {
  args: {},
}

export const Loading: StoryObj<typeof UnauthorizedErrorScreen> = {
  args: {
    isLoading: true,
  },
}
