import { userEvent, within } from '@storybook/test'
import React from 'react'

import { Button } from '../../Button'
import { FaArrowsRotateIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { Text } from '../../Text'
import { AppNavi } from '../AppNavi'

import { Template } from './AppNavi.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/AppNavi/VRT',
  render: (args) => (
    <Stack className="shr-h-screen">
      {[undefined, 'hover', 'focus-visible'].map((id) => (
        <Template {...args} key={id} id={id} />
      ))}
    </Stack>
  ),
  args: {
    label: '機能名',
    additionalArea: (
      <Cluster align="center">
        <Text size="S">最終同期： 2024/11/21 10:13</Text>
        <Button size="s" prefix={<FaArrowsRotateIcon />}>
          データを同期
        </Button>
      </Cluster>
    ),
  },
  parameters: {
    pseudo: {
      hover: ['#hover button, #hover a'],
      focusVisible: ['#focus-visible button, #focus-visible a'],
    },
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: dropdownButton } = await canvas.findAllByRole('button', {
      name: 'ドロップダウンボタン 候補を開く',
    })
    await userEvent.click(dropdownButton)
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof AppNavi>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
