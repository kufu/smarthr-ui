import { Fragment } from 'react'

import { FaAddressBookIcon } from '../../../../Icon'
import { Stack } from '../../../../Layout'
import { PageHeading } from '../PageHeading'

import type { StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Heading/PageHeading/VRT',
  // ペアワイズ法は使わずに総当りする
  render: (args: any) => {
    const sizes = [undefined, 'XXL', 'XL', 'L'] as const
    return (
      <Stack {...args}>
        {sizes.map((size) => (
          <Fragment key={size || 'default'}>
            <PageHeading visuallyHidden={true} size={size} icon={<FaAddressBookIcon />}>
              {size ? size : 'undefined'}
            </PageHeading>
            <PageHeading visuallyHidden={false} size={size}>
              {size ? size : 'undefined'}
            </PageHeading>
            <PageHeading size={size} icon={<FaAddressBookIcon />}>
              {size ? size : 'undefined'}
            </PageHeading>
          </Fragment>
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
