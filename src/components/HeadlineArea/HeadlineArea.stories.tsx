import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { HeadlineArea } from './HeadlineArea'

const heading = {
  children: 'HeadlineArea',
}

storiesOf('HeadlineArea', module).add('all', () => (
  <HeadlineArea
    heading={heading}
    description="画面説明テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト"
  />
))
