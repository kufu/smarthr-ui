import { StoryFn } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { Stack } from '../Layout'

import { PageCounter } from './PageCounter'

export default {
  title: 'Data Display（データ表示）/PageCounter',
  component: PageCounter,
}

const Template: StoryFn<ComponentProps<typeof PageCounter>> = (props) => <PageCounter {...props} />

export const All = () => (
  <Stack>
    <Template start={1} end={50} />
    <Template start={1} end={50} total={5000} />
    <Template
      start={1}
      end={50}
      total={5000}
      visibleOrder={{
        range: 1,
        total: 2,
      }}
      decorators={{
        before: () => '(before)',
        beforeRange: () => '(beforeRange)',
        rangeSeparator: (org) => `(rangeSeparator: "${org}")`,
        rangeSeparatorVisuallyHiddenText: (org) => `(rangeSeparatorVisuallyHiddenText: "${org}")`,
        unit: (org) => `(unit: "${org}")`,
        afterRange: () => '(afterRange)',
        betweenTotalAndRange: () => '(betweenTotalAndRange)',
        beforeTotal: () => '(beforeTotal)',
        afterTotal: (org) => `(afterTotal: "${org}")`,
        after: () => '(after)',
      }}
    />
  </Stack>
)
