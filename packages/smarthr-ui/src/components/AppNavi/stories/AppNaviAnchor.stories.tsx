import React, { ComponentPropsWithoutRef } from 'react'

import { backgroundColor } from '../../../themes'
import { FaGearIcon } from '../../Icon'
import { AppNaviAnchor } from '../AppNaviAnchor'

import type { Meta, StoryObj } from '@storybook/react'

const _iconOptoins = {
  なし: undefined,
  あり: FaGearIcon,
}
const _elementAsOptions = {
  なし: undefined,
  あり: ({
    to,
    ...rest
  }: Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
    to: ComponentPropsWithoutRef<'a'>['href']
    // eslint-disable-next-line jsx-a11y/anchor-has-content
  }) => <a {...rest} href={to} />,
}

export default {
  title: 'Navigation（ナビゲーション）/AppNavi/AppNaviAnchor',
  component: AppNaviAnchor,
  render: (args) => <AppNaviAnchor {...args} />,
  argTypes: {
    icon: {
      control: 'radio',
      options: Object.keys(_iconOptoins),
      mapping: _iconOptoins,
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
    icon: _iconOptoins['あり'],
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
