import React from 'react'

import { Stack } from '../../Layout'
import { Base } from '../Base'

import { baseLayer, basePadding } from './Base.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Base/VRT',
  render: (args) => (
    <Stack>
      {[undefined, ...basePadding].map((blockPadding) =>
        [undefined, ...basePadding].map((inlinePadding) =>
          [undefined, ...baseLayer].map((layer) => (
            <React.Fragment key={[blockPadding, inlinePadding, layer].join()}>
              <Base
                {...args}
                padding={{ block: blockPadding, inline: inlinePadding }}
                radius="m"
                layer={layer}
              >
                block: {blockPadding || 'undefined'}, inline: {inlinePadding}, rasius: m
              </Base>
              <Base
                {...args}
                padding={{ block: blockPadding, inline: inlinePadding }}
                radius="s"
                layer={layer}
              >
                block: {blockPadding || 'undefined'}, inline: {inlinePadding}, rasius: s
              </Base>
            </React.Fragment>
          )),
        ),
      )}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Base>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
