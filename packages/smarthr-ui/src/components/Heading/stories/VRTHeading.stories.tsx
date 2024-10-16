/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import React from 'react'

import { Stack } from '../../Layout'
import { Heading } from '../Heading'

import type { StoryObj } from '@storybook/react'

export default {
  title: 'Text（テキスト）/Heading/VRT',
  // ペアワイズ法は使わずに総当りする
  render: (args: any) => {
    const types = [
      'screenTitle',
      'blockTitle',
      'subBlockTitle',
      'sectionTitle',
      'subSubBlockTitle',
    ] as const
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
    return (
      <Stack {...args}>
        {types.map((type) => (
          <Stack key={type}>
            {tags.map((tag) => (
              <>
                <Heading key={tag} type={type} tag={tag} visuallyHidden={true}>
                  {type}
                </Heading>
                <Heading key={tag} type={type} tag={tag} visuallyHidden={false}>
                  {type}
                </Heading>
              </>
            ))}
          </Stack>
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
