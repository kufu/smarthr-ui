import { action } from 'storybook/actions'

import { FaGearIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { SideNav, type SideNavItemButtonProps } from '../SideNav'
import { SideNavItemAnchor, SideNavItemButton, type SideNavSizeType } from '../SideNavItemButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export const _sideNavItems: SideNavItemButtonProps[] = [
  {
    id: 'id-1',
    children: 'サイドナビ1',
    current: true,
  },
  {
    id: 'id-2',
    children: 'サイドナビ2',
    current: false,
  },
  {
    id: 'id-3',
    children: 'サイドナビ3',
    current: false,
    prefix: <StatusLabel>ラベル</StatusLabel>,
  },
  {
    id: 'id-4',
    children: 'サイドナビ3',
    current: false,
    prefix: <FaGearIcon />,
    suffix: <StatusLabel>ラベル</StatusLabel>,
  },
]

export default {
  title: 'Components/SideNav',
  component: SideNav,
  argTypes: {
    items: {
      control: false,
    },
  },
  render: (args) => {
    const { items, ...rest } = args
    return items ? (
      <SideNav {...rest} items={items} />
    ) : (
      <SideNav {...rest}>
        {_sideNavItems.map((item, index) => {
          const commonAttrs = {
            key: item.id,
            id: item.id,
            current: item.current,
            prefix: item.prefix,
            children: item.children,
          }

          return index % 2 === 0 ? (
            <SideNavItemButton {...commonAttrs} />
          ) : (
            <SideNavItemAnchor {...commonAttrs} href={`#${index}`} />
          )
        })}
      </SideNav>
    )
  },
  excludeStories: ['_sideNavItems'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SideNav>

export const Playground: StoryObj<typeof SideNav> = {
  args: {},
}

export const Items: StoryObj<typeof SideNav> = {
  name: 'items（非推奨）',
  argTypes: {
    items: {
      control: { disable: false, type: 'object' },
    },
  },
  args: {
    items: [
      {
        id: 'id-1',
        title: 'サイドナビ1',
        current: false,
      },

      {
        id: 'id-2',
        title: 'サイドナビ2',
        current: true,
      },

      {
        id: 'id-3',
        title: 'サイドナビ3',
        current: false,
        prefix: <StatusLabel>ラベル</StatusLabel>,
      },
    ],
  },
}

export const Size: StoryObj<typeof SideNav> = {
  name: 'size',
  render: (args) => (
    <Stack>
      {[undefined, 'default', 's'].map((size, i) => (
        <SideNav {...args} key={i} size={size as SideNavSizeType}>
          {_sideNavItems.map((item) => (
            <SideNavItemButton
              key={item.id + i}
              id={item.id + i}
              current={item.current}
              prefix={item.prefix}
            >
              {item.children}
            </SideNavItemButton>
          ))}
        </SideNav>
      ))}
    </Stack>
  ),
}

export const OnClick: StoryObj<typeof SideNav> = {
  name: 'onClick',
  args: {
    onClick: (_, id) => {
      action('clicked')(id)
    },
  },
}
