import { StoryFn } from '@storybook/react'
import React from 'react'

import { RangeSeparator } from './RangeSeparator'

export default {
  title: 'Text（テキスト）/RangeSeparator',
  component: RangeSeparator,
}

export const Default: StoryFn = () => (
  <dl>
    <dt>default</dt>
    <dd>
      <RangeSeparator />
    </dd>
    <dt>decorators</dt>
    <dd>
      <RangeSeparator
        decorators={{
          text: () => `-`,
          visuallyHiddenText: (original) => `to (original: ${original})`,
        }}
      />
    </dd>
  </dl>
)
