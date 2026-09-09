import TabBarStories from './TabBar.stories'

import type { StoryObj } from '@storybook/react-vite'

export default {
  ...TabBarStories,
  title: 'Components/TabBar/bordered',
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
