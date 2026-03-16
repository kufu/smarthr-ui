import { backgroundColor } from '../../../themes'
import { FaGearIcon } from '../../Icon'
import { AppNaviAnchor } from '../AppNaviAnchor'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentPropsWithoutRef } from 'react'

const _iconOptions = {
  なし: undefined,
  あり: FaGearIcon,
}
const _elementAsOptions = {
  なし: undefined,
  あり: ({
    to,
    children,
    ...rest
  }: Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
    to: ComponentPropsWithoutRef<'a'>['href']
  }) => (
    <a {...rest} href={to}>
      {children}
    </a>
  ),
}

export default {
  title: 'Components/AppNavi/AppNaviAnchor',
  component: AppNaviAnchor,
  render: (args) => <AppNaviAnchor {...args} />,
  argTypes: {
    icon: {
      control: 'radio',
      options: Object.keys(_iconOptions),
      mapping: _iconOptions,
    },
    elementAs: {
      control: 'radio',
      options: Object.keys(_elementAsOptions),
      mapping: _elementAsOptions,
    },
    ref: {
      control: false,
    },
  },
  args: {
    children: 'アンカーボタン',
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
    chromatic: { disableSnapshot: true },
  },
  excludeStories: ['Template'],
} satisfies Meta<typeof AppNaviAnchor>

export const Playground: StoryObj<typeof AppNaviAnchor> = {}

export const Href: StoryObj<typeof AppNaviAnchor> = {
  name: 'href',
  args: {
    href: '/',
  },
}

export const Icon: StoryObj<typeof AppNaviAnchor> = {
  name: 'icon',
  args: {
    icon: _iconOptions['あり'],
  },
}

export const Current: StoryObj<typeof AppNaviAnchor> = {
  name: 'current',
  args: {
    current: true,
  },
}

export const ElementAs: StoryObj<typeof AppNaviAnchor> = {
  name: 'elementAs',
  args: {
    elementAs: _elementAsOptions.あり,
    to: '#',
    children: 'next/link などを想定したリンク',
  },
}
