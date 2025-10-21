import { Stack } from '../../Layout'
import { Heading } from '../Heading'
import { FaAddressBookIcon } from '../../Icon'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Components/Heading/VRT',
  // ペアワイズ法は使わずに総当りする
  render: (args: any) => {
    const types = [
      undefined,
      'blockTitle',
      'subBlockTitle',
      'sectionTitle',
      'subSubBlockTitle',
    ] as const
    const tags = [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
    const sizes = [undefined, 'XXL', 'XL', 'L'] as const
    return (
      <Stack {...args}>
        {types.map((type) =>
          tags.map((tag) =>
            sizes.map((size) => (
              <>
                {/* @ts-expect-error */}
                <Heading type={type} size={size} tag={tag} visuallyHidden={true}>
                  {type ? type : 'undefined'}
                </Heading>
                {/* @ts-expect-error */}
                <Heading type={type} size={size} tag={tag} visuallyHidden={false}>
                  {type ? type : 'undefined'}
                </Heading>
                {/* @ts-expect-error */}
                <Heading type={type} size={size} tag={tag} icon={<FaAddressBookIcon />}>
                  {type ? type : 'undefined'}
                </Heading>
              </>
            )),
          ),
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
