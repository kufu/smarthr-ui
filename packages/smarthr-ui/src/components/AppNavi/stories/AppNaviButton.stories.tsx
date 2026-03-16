import { action } from 'storybook/actions'

import { backgroundColor } from '../../../themes'
import { FaGearIcon } from '../../Icon'
import { AppNaviButton } from '../AppNaviButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _iconOptions = {
  なし: undefined,
  あり: FaGearIcon,
}

export default {
  title: 'Components/AppNavi/AppNaviButton',
  component: AppNaviButton,
  render: (args) => <AppNaviButton {...args} />,
  argTypes: {
    icon: {
      control: 'radio',
      options: Object.keys(_iconOptions),
      mapping: _iconOptions,
    },
  },
  args: {
    children: 'ボタン',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNaviButton>

export const Playground: StoryObj<typeof AppNaviButton> = {}

export const Icon: StoryObj<typeof AppNaviButton> = {
  name: 'icon',
  args: {
    icon: _iconOptions['あり'],
  },
}

export const Current: StoryObj<typeof AppNaviButton> = {
  name: 'current',
  args: {
    current: true,
  },
}

export const OnClick: StoryObj<typeof AppNaviButton> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
  },
}
