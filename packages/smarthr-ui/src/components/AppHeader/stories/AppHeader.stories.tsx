import { Meta, StoryObj } from '@storybook/react/*'

import { AppHeader } from '../AppHeader'

import { args } from './args'

const meta = {
  title: 'Navigation（ナビゲーション）/AppHeader',
  component: AppHeader,
  args,
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
