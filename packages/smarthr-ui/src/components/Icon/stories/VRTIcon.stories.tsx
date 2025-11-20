import { Stack } from '../../Layout'
import { FaAddressBookIcon, WarningIcon } from '../Icon'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Icon/VRT',
  render: () => (
    <Stack>
      {Object.entries({ FaAddressBookIcon, WarningIcon }).map(([name, Icon]) => (
        <Stack key={name}>
          <Icon />
          <Icon color="TEXT_GREY" />
          <Icon color="TEXT_LINK" alt="アイコン" />
          <Icon alt="アイコン" />
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
