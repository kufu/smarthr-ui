import TabBarStories from './TabBar.stories'

import type { StoryObj } from '@storybook/react'

export default {
  ...TabBarStories,
  title: 'Navigation（ナビゲーション）/TabBar/bordered',
  tags: ['!autodocs'],
}

export const True: StoryObj = {
  name: 'true',
  args: {
    bordered: true,
  },
}

export const False = {
  name: 'false',
  args: {
    bordered: false,
  },
}
