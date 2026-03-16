import { action } from 'storybook/actions'

import { HelpLink } from '../HelpLink'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentPropsWithoutRef } from 'react'

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
  title: 'Components/TextLink/HelpLink',
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
