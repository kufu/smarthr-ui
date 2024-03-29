import { Story } from '@storybook/react'
import React, { ComponentProps } from 'react'

import { Stack } from '../Layout'

import { PageCounter } from './PageCounter'

export default {
  title: 'Data Display（データ表示）/PageCounter',
  component: PageCounter,
}

const Template: Story<ComponentProps<typeof PageCounter>> = (props) => <PageCounter {...props} />

export const All = () => (
  <Stack>
    <Template start={1} end={50} />
    <Template
      start={1}
      end={50}
      total={5000}
      decorators={{ rangeSeparatorVisuallyHiddenText: () => '件から' }}
    />
  </Stack>
)
