import { DeviceProvider } from './DeviceProvider'
import { useDevice } from './useDevice'

import type { StoryFn } from '@storybook/react-webpack5'
import type { FC } from 'react'

export default {
  title: 'Hooks/useDevice',
  component: useDevice,
  decorators: [
    (Story: FC) => (
      <DeviceProvider>
        <Story />
      </DeviceProvider>
    ),
  ],
}

export const Default: StoryFn = () => {
  const { isNarrowView } = useDevice()

  return <p>isNarrowView: {isNarrowView?.toString()}</p>
}

Default.parameters = {
  chromatic: {
    viewports: [599, 600],
  },
}
