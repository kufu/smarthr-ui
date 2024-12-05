/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { Meta } from '@storybook/react/*'
import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { SideNav } from '../SideNav'
import { SideNavItemButton } from '../SideNavItemButton'

import { SideNavItems } from './SideNav.stories'

const _casse: Array<ComponentProps<typeof SideNav>['size']> = [undefined, 'default', 's']

export default {
  title: 'Navigation（ナビゲーション）/SideNav/VRT',
  component: SideNav,
  render: (args) => (
    <Stack gap={2}>
      {_casse.map((size, i) => (
        <SideNav {...args} key={i} size={size}>
          {SideNavItems.map((item) => (
            <SideNavItemButton
              key={item.id}
              id={item.id}
              isSelected={item.isSelected}
              prefix={item.prefix}
            >
              {item.children}
            </SideNavItemButton>
          ))}
        </SideNav>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof SideNav>

export const VRT = {}

export const VRTHoverFocus = {
  parameters: {
    pseudo: {
      hover: ['li'],
      focusVisible: ['button'],
    },
  },
}

export const VRTForcedColors = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
