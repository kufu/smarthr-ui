import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { FormGroup } from './FormGroup'
import { Input } from '../Input'

import readme from './README.md'

storiesOf('FormGroup', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <FormGroup label="hoge">
      <Input />
    </FormGroup>
  ))
