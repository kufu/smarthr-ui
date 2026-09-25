import { NotFoundErrorScreen } from '../NotFoundErrorScreen'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/ErrorScreen/NotFoundErrorScreen',
  component: NotFoundErrorScreen,
  render: (args) => <NotFoundErrorScreen {...args} />,
  args: {
    homeUrl: '/',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof NotFoundErrorScreen>

export const Playground: StoryObj<typeof NotFoundErrorScreen> = {
  args: {},
}
