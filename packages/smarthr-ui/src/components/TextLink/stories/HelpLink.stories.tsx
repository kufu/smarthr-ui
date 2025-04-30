import { action } from '@storybook/addon-actions'

import { HelpLink } from '..'

import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentPropsWithoutRef } from 'react'

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
  title: 'Navigation（ナビゲーション）/HelpLink',
  component: HelpLink,
  render: (args) => <HelpLink {...args} />,
  argTypes: {
    href: {
      control: 'text',
    },
    elementAs: {
      control: 'radio',
      options: Object.keys(_elementAsOptions),
      mapping: _elementAsOptions,
    },
  },
  args: {
    href: '#',
    children: 'ヘルプリンク',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof HelpLink>

type Story = StoryObj<typeof HelpLink>

export const Playground: Story = {}

export const Href: Story = {
  name: 'href',
  args: {
    href: undefined,
    children: 'href なし',
  },
}

export const TargetBlank: Story = {
  name: 'target="_blank"',
  args: {
    target: '_blank',
    children: '別タブで開くリンク',
  },
}

export const Size: Story = {
  name: 'size',
  render: (args) => (
    <>
      {([undefined, 'M', 'S'] as const).map((size, index) => (
        <p key={index}>
          <HelpLink {...args} size={size}>
            {size || 'size未指定'}
          </HelpLink>
        </p>
      ))}
    </>
  ),
}

export const OnClick: Story = {
  name: 'onClick',
  args: {
    onClick: action('click'),
    href: undefined,
  },
}

export const ElementAs: Story = {
  name: 'elementAs',
  args: {
    elementAs: _elementAsOptions.あり,
    href: undefined,
    to: '#',
    children: 'next/link などを想定したリンク',
  },
}
