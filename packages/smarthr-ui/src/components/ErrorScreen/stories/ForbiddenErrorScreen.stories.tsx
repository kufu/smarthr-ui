import { ForbiddenErrorScreen } from '../ForbiddenErrorScreen'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/ErrorScreen/ForbiddenErrorScreen',
  component: ForbiddenErrorScreen,
  render: (args) => <ForbiddenErrorScreen {...args} />,
  args: {
    homeUrl: '/',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ForbiddenErrorScreen>

export const Playground: StoryObj<typeof ForbiddenErrorScreen> = {
  args: {},
}
