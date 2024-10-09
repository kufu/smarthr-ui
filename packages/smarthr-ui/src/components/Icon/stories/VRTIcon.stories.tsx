import React from 'react'

import { Stack } from '../../Layout'
import { FaAddressBookIcon, WarningIcon } from '../Icon'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Media（メディア）/Icon/VRT',
  /**
   * $ pict icon.pict
   * color   alt  text gap    right
   * default なし  なし default false
   * default あり  あり others  true
   * others  なし  あり others  true
   * others  あり  あり default true
   * others  あり  あり others  false
   * others  あり  なし others  false
   */
  render: () => (
    <Stack>
      {Object.entries({ FaAddressBookIcon, WarningIcon }).map(([name, Icon]) => (
        <Stack key={name}>
          <Icon />
          <Icon text={name} iconGap={0.5} right />
          <Icon color="TEXT_GREY" text={name} iconGap={0.5} right />
          <Icon color="TEXT_LINK" alt="アイコン" text={name} right />
          <Icon color="DANGER" alt="アイコン" text={name} iconGap={0.5} />
          <Icon color="TEXT_DISABLED" alt="アイコン" iconGap={0.5} />
        </Stack>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
}

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
