import { Meta } from '@storybook/react/*'
import React, { ComponentProps } from 'react'

import { Stack } from '../../Layout'
import { SideNav } from '../SideNav'

import { SideNavItems } from './SideNav.stories'

const _casse: Array<ComponentProps<typeof SideNav>['size']> = ['default', 's']

export default {
  title: 'Navigation（ナビゲーション）/SideNav/VRT',
  component: SideNav,
  render: (args) => (
    <div style={{ width: '200px' }}>
      <Stack gap={2}>
        {_casse.map((size, i) => (
          <SideNav {...args} key={i} size={size} />
        ))}
      </Stack>
    </div>
  ),
  args: {
    items: SideNavItems,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof SideNav>

export const VRTHover = {
  parameters: {
    pseudo: {
      hover: ['li'],
    },
  },
}

export const VRTFocus = {
  parameters: {
    pseudo: {
      focusVisible: ['button'],
    },
  },
}

export const VRTForcedColors = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
