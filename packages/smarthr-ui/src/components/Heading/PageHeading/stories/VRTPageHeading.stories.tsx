import { Stack } from '../../../Layout'
import { PageHeading } from '../PageHeading'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Heading/PageHeading/VRT',
  // ペアワイズ法は使わずに総当りする
  render: (args: any) => {
    const sizes = [undefined, 'XXL', 'XL', 'L'] as const
    return (
      <Stack {...args}>
        {sizes.map((size) => (
          <>
            <PageHeading size={size} visuallyHidden={true}>
              {size ? size : 'undefined'}
            </PageHeading>
            <PageHeading size={size} visuallyHidden={false}>
              {size ? size : 'undefined'}
            </PageHeading>
          </>
        ))}
      </Stack>
    )
  },
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
