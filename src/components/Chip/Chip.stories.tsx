import { StoryFn } from '@storybook/react'
import React from 'react'

import { Cluster } from '../Layout'

import { Chip } from '.'

export default {
  title: 'Data Display（データ表示）/Chip',
  component: Chip,
}

export const All: StoryFn = () => (
  <Cluster>
    <Chip>ラベル</Chip>
    <Chip disabled>ラベル[disabled]</Chip>
  </Cluster>
)
