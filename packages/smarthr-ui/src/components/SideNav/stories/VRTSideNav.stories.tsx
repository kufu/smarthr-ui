import { type ComponentProps, Fragment } from 'react'

import { Stack } from '../../Layout'
import { SideNav } from '../SideNav'
import { SideNavItemButton } from '../SideNavItemButton'

import { _sideNavItems } from './SideNav.stories'

import type { Meta } from '@storybook/react-webpack5'

const _casse: Array<ComponentProps<typeof SideNav>['size']> = [undefined, 'default', 's']

export default {
  title: 'Components/SideNav/VRT',
  component: SideNav,
  argTypes: {
    items: {
      control: false,
    },
  },
  render: (args) => (
    <Stack gap={2} className="shr-p-1">
      {[undefined, 'hover', 'focus-visible'].map((id, index) => (
        <Fragment key={index}>
          {_casse.map((size, i) => (
            <SideNav {...args} key={`${index}-${i}`} size={size} id={id}>
              {_sideNavItems.map((item) => (
                <SideNavItemButton
                  key={item.id}
                  id={item.id}
                  current={item.current}
                  prefix={item.prefix}
                >
                  {item.children}
                </SideNavItemButton>
              ))}
            </SideNav>
          ))}
        </Fragment>
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
