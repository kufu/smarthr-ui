import { Stack } from '../../../Layout'
import { PageHeading } from '../PageHeading'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Heading/PageHeading/VRT',
  // ペアワイズ法は使わずに総当りする
  render: (args: any) => {
    const types = [
      'screenTitle',
      'blockTitle',
      'subBlockTitle',
      'sectionTitle',
      'subSubBlockTitle',
    ] as const
    const sizes = ['XXL', 'XL', 'L'] as const
    return (
      <Stack {...args}>
        {types.map((type) =>
          sizes.map((size) => (
            <>
              {/* @ts-expect-error */}
              <PageHeading type={type} size={size} visuallyHidden={true}>
                {type}
              </PageHeading>
              {/* @ts-expect-error */}
              <PageHeading type={type} size={size} visuallyHidden={false}>
                {type}
              </PageHeading>
            </>
          )),
        )}
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
