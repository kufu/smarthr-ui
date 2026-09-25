import { UnexpectedErrorScreen } from '../UnexpectedErrorScreen'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/ErrorScreen/UnexpectedErrorScreen',
  component: UnexpectedErrorScreen,
  render: (args) => <UnexpectedErrorScreen {...args} />,
  args: {
    homeUrl: '/',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof UnexpectedErrorScreen>

export const Playground: StoryObj<typeof UnexpectedErrorScreen> = {
  args: {},
}
