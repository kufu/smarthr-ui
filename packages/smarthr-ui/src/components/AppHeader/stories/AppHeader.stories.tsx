import { AppHeader } from '../AppHeader'

import { args } from './args'

import type { Meta, StoryObj } from '@storybook/react-webpack5/*'

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  args,
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
