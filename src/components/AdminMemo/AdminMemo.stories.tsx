import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { AdminMemoItem } from './AdminMemoItem'

import readme from './README.md'

storiesOf('AdminMemo', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <AdminMemoItem
      comment="コメントほげほげほげほげ"
      date="2020-04-15 16:20:00"
      author="koji.miyahara+test190508@smarthr.co.jp"
      editOnClick={action('click!!')}
    />
  ))
