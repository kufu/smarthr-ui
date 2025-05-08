import { action } from '@storybook/addon-actions'
import { ComponentPropsWithoutRef } from 'react'

import { FaCircleQuestionIcon, FaUpRightFromSquareIcon } from '../../Icon'
import { UpwardLink } from '../../UpwardLink'
import { TextLink } from '../TextLink'
import { Table, Th } from '../../Table'

import type { Meta, StoryObj } from '@storybook/react'

const _prefixOptions = {
  なし: undefined,
  あり: <FaCircleQuestionIcon />,
}
const _suffixOptions = {
  なし: undefined,
  あり: <FaUpRightFromSquareIcon />,
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
  title: 'Navigation（ナビゲーション）/TextLink',
  component: TextLink,
  subcomponents: { UpwardLink },
  render: (args) => <TextLink {...args} />,
  argTypes: {
    href: {
      control: 'text',
    },
    prefix: {
      control: 'radio',
      options: Object.keys(_prefixOptions),
      mapping: _prefixOptions,
    },
    suffix: {
      control: 'radio',
      options: Object.keys(_suffixOptions),
      mapping: _suffixOptions,
    },
    elementAs: {
      control: 'radio',
      options: Object.keys(_elementAsOptions),
      mapping: _elementAsOptions,
    },
  },
  args: {
    href: '#',
    children: 'リンク',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof TextLink>

export const Playground: StoryObj<typeof TextLink> = {}

export const Href: StoryObj<typeof TextLink> = {
  name: 'href',
  args: {
    href: undefined,
    children: 'href なし',
  },
}

export const Prefix: StoryObj<typeof TextLink> = {
  name: 'prefix',
  args: {
    prefix: <FaCircleQuestionIcon />,
    children: 'プレフィックス付きリンク',
  },
}

export const Suffix: StoryObj<typeof TextLink> = {
  name: 'suffix',
  args: {
    suffix: <FaUpRightFromSquareIcon />,
    children: 'サフィックス付きリンク',
  },
}

export const TargetBlank: StoryObj<typeof TextLink> = {
  name: 'target="_blank"',
  args: {
    target: '_blank',
    children: '別タブで開くリンク',
  },
}

export const Size: StoryObj<typeof TextLink> = {
  name: 'size',
  render: (args) => (
    <>
      {([undefined, 'M', 'S'] as const).map((size) => (
        <p>
          <TextLink {...args} size={size}>
            {size || 'size未指定'}
          </TextLink>
        </p>
      ))}
    </>
  ),
}

export const OnClick: StoryObj<typeof TextLink> = {
  name: 'onClick',
  args: {
    onClick: action('click'),
    href: undefined,
  },
}

export const ElementAs: StoryObj<typeof TextLink> = {
  name: 'elementAs',
  args: {
    elementAs: _elementAsOptions.あり,
    href: undefined,
    to: '#',
    children: 'next/link などを想定したリンク',
  },
}

export const InTh: StoryObj<typeof TextLink> = {
  name: 'in Th Component',
  render: (args) => (
    <Table>
      <thead>
        <tr>
          <Th>
            <TextLink {...args} />
          </Th>
        </tr>
      </thead>
    </Table>
  ),
}
