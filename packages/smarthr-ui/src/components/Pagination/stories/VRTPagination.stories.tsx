import { fireEvent, within } from '@storybook/test'
import React from 'react'

import { Stack } from '../../Layout'
import { Pagination } from '../Pagination'

import { Current } from './Pagination.stories'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Navigation（ナビゲーション）/Pagination/VRT',
  render: (args, context) => (
    <Stack>
      {Current.render?.(args, context)}
      {Current.render?.({ ...args, padding: 1 }, context)}
      {Current.render?.({ ...args, withoutNumbers: true }, context)}
    </Stack>
  ),
  args: {
    total: 11,
    current: 6,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Pagination>

export default meta

export const VRT: StoryObj<typeof Pagination> = {
  render: (args, context) => (
    <Stack>
      {[undefined, 'hover', 'focus-visible'].map((id) => (
        <div id={id} key={id}>
          {meta.render?.(args, context)}
        </div>
      ))}
    </Stack>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover button'],
      focusVisible: ['#focus-visible button'],
    },
  },
}

export const VRTNarrowView: StoryObj<typeof Pagination> = {
  render: meta.render,
  parameters: {
    viewport: {
      defaultViewport: 'vrtMobile',
    },
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const scrollableParents = await canvas.findAllByRole('navigation')
    scrollableParents.forEach(async (scrollableParent) => {
      // nav の直下の div がスクロールする要素
      fireEvent.scroll(scrollableParent.firstElementChild!, { target: { scrollLeft: 1000 } })
    })
  },
}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
