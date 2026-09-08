import { Stack } from '../../Layout'
import { FaAddressBookIcon } from '../FaIcon'
import { WarningIcon } from '../WarningIcon'

import type { StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Icon/VRT',
  render: () => (
    <Stack>
      {Object.entries({ FaAddressBookIcon, WarningIcon }).map(([name, Icon]) => (
        <Stack key={name}>
          <Icon />
          <Icon color="TEXT_GREY" />
          <Icon alt="アイコン" color="TEXT_LINK" />
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
