import TabBarStories from './TabBar.stories'

import type { StoryObj } from '@storybook/react-vite'

export default {
  ...TabBarStories,
  title: 'Components/TabBar/grow',
  tags: ['!autodocs'],
}

export const True: StoryObj = {
  name: 'true',
  args: {
    grow: true,
  },
}

export const False = {
  name: 'false',
  args: {
    grow: false,
  },
}
