import { StoryFn } from '@storybook/react'
import React from 'react'

import { Stack } from '../Layout'

import { Chip } from '.'

export default {
  title: 'Data Display（データ表示）/Chip',
  component: Chip,
}

export const All: StoryFn = () => (
  <Stack as="dl" gap={3}>
    <Stack align="flex-start">
      <Chip label="ラベル" />
      <Chip label="Label" />
      <Chip label="label" />
      <Chip label="Label ラベル" aria-label="ラベル" />
    </Stack>
  </Stack>
)
