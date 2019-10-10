import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Select } from './Select'

storiesOf('Select', module).add('all', () => (
  <List>
    <li>
      <Text>default</Text>
      <Select
        name="sample1"
        value=""
        options={[
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'banana', value: 'banana' },
        ]}
      />
    </li>
    <li>
      <Text>error</Text>
      <Select
        name="sample2"
        value=""
        error={true}
        options={[
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'banana', value: 'banana' },
        ]}
      />
    </li>
    <li>
      <Text>disabled</Text>
      <Select
        name="sample3"
        value=""
        disabled={true}
        options={[
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'banana', value: 'banana' },
        ]}
      />
    </li>
    <li>
      <Text>placeholder</Text>
      <Select
        name="sample4"
        value=""
        options={[
          { label: 'Fruit', value: '' },
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'banana', value: 'banana' },
        ]}
      />
    </li>
    <li>
      <Text>width</Text>
      <Select
        name="sample5"
        value="width: 100%"
        width="100%"
        options={[
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'banana', value: 'banana' },
        ]}
      />
    </li>
    <li>
      <Text>onChange</Text>
      <Select
        name="sample6"
        value=""
        onChange={action('onChange!!')}
        options={[
          { label: 'apple', value: 'apple' },
          { label: 'orange', value: 'orange' },
          { label: 'banana', value: 'banana' },
        ]}
      />
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 16px;
  }
`
const Text = styled.p`
  margin: 0 0 8px 0;
`
