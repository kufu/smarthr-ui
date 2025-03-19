import { StoryFn } from '@storybook/react/*'
import { FC } from 'react'

import { DeviceProvider } from './DeviceProvider'
import { useDevice } from './useDevice'

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
