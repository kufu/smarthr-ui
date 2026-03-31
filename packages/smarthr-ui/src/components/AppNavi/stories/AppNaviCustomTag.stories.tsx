import { backgroundColor } from '../../../themes'
import { FaGearIcon } from '../../Icon'
import { AppNaviCustomTag } from '../AppNaviCustomTag'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { FC, ReactNode } from 'react'

const _iconOptions = {
  なし: undefined,
  あり: FaGearIcon,
}

const Link: FC<{
  to: string
  children: ReactNode
  disabled?: boolean
  className?: string
}> = ({ to, children, disabled = false, className = '', ...rest }) => (
  <a {...rest} {...(disabled ? {} : { href: to })} className={className}>
    {children}
  </a>
)

export default {
  title: 'Components/AppNavi/AppNaviCustomTag',
  component: AppNaviCustomTag,
  render: (args) => <AppNaviCustomTag {...args} />,
  argTypes: {
    icon: {
      control: 'radio',
      options: Object.keys(_iconOptions),
      mapping: _iconOptions,
    },
  },
  args: {
    tag: Link,
    children: 'カスタムタグ',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNaviCustomTag>

export const Playground: StoryObj<typeof AppNaviCustomTag> = {}

export const Icon: StoryObj<typeof AppNaviCustomTag> = {
  name: 'icon',
  args: {
    icon: _iconOptions['あり'],
  },
}

export const Current: StoryObj<typeof AppNaviCustomTag> = {
  name: 'current',
  args: {
    current: true,
  },
}
