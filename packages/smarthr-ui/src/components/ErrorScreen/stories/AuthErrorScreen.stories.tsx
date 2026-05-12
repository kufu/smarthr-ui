import { AuthErrorScreen } from '../AuthErrorScreen'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/ErrorScreen/AuthErrorScreen',
  component: AuthErrorScreen,
  render: (args) => <AuthErrorScreen {...args} />,
  args: {
    smarthrUrl: 'https://example.smarthr.jp',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof AuthErrorScreen>

export const Playground: StoryObj<typeof AuthErrorScreen> = {
  args: {},
}
