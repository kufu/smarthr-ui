import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { HeadlineArea } from './HeadlineArea'

import readme from './README.md'

const heading = {
  children: 'HeadlineArea',
}

storiesOf('HeadlineArea', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <HeadlineArea
      heading={heading}
      description="画面説明テキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキストテキスト"
    />
  ))
