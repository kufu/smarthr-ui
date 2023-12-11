import { StoryFn } from '@storybook/react'
import React from 'react'

import { Stack } from '../Layout'

import { Chip } from '.'

export default {
  title: 'Data Display（データ表示）/Chip',
  component: Chip,
}

export const All: StoryFn = () => (
  <Stack align="flex-start">
    <Chip>ラベル</Chip>
  </Stack>
)
