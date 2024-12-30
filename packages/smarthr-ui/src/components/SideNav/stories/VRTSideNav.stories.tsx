/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { Meta } from '@storybook/react/*'
import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { SideNav } from '../SideNav'
import { SideNavItemButton } from '../SideNavItemButton'

import { _sideNavItems } from './SideNav.stories'

const _casse: Array<ComponentProps<typeof SideNav>['size']> = [undefined, 'default', 's']

export default {
  title: 'Navigation（ナビゲーション）/SideNav/VRT',
  component: SideNav,
  argTypes: {
    items: {
      control: false,
    },
  },
  render: (args) => (
    <Stack gap={2}>
      {[undefined, 'hover', 'focus-visible'].map((id, index) => (
        <React.Fragment key={index}>
          {_casse.map((size, i) => (
            <SideNav {...args} key={`${index}-${i}`} size={size} id={id}>
              {_sideNavItems.map((item) => (
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
        </React.Fragment>
      ))}
    </Stack>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover li'],
      focusVisible: ['#focus-visible button'],
    },
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof SideNav>

export const VRT = {}

export const VRTForcedColors = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
