import React, { ComponentPropsWithoutRef } from 'react'

import { Stack } from '../../Layout'
import { UpwardLink } from '../UpwardLink'

import type { Meta, StoryObj } from '@storybook/react'

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
  title: 'Navigation（ナビゲーション）/UpwardLink',
  component: UpwardLink,
  render: (args) => <UpwardLink {...args} />,
  argTypes: {
    elementAs: {
      control: 'radio',
      options: Object.keys(_elementAsOptions),
      mapping: _elementAsOptions,
    },
  },
  args: {
    href: '#',
    children: '一覧に戻る',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof UpwardLink>

export const Playground: StoryObj<typeof UpwardLink> = {}

export const Indent: StoryObj<typeof UpwardLink> = {
  name: 'indent',
  render: (args) => (
    <Stack>
      {[undefined, true, false].map((indent, i) => (
        <div key={i}>
          <UpwardLink {...args} indent={indent}>
            {`indent={${String(indent)}}`}
          </UpwardLink>
        </div>
      ))}
    </Stack>
  ),
}

export const ElementAs: StoryObj<typeof UpwardLink> = {
  name: 'elementAs',
  args: {
    elementAs: _elementAsOptions.あり,
    href: undefined,
    to: '#',
    children: 'next/link などを想定したリンク',
  },
}
