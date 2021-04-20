import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Select } from './Select'

import readme from './README.md'

storiesOf('Select', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <li>
        <Text>default</Text>
        <Select
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Banana', value: 'banana' },
            { label: 'Melon', value: 'melon', disabled: true },
          ]}
        />
      </li>
      <li>
        <Text>value</Text>
        <Select
          value="orange"
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Banana', value: 'banana' },
          ]}
        />
      </li>
      <li>
        <Text>error</Text>
        <Select
          error
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Banana', value: 'banana' },
          ]}
        />
      </li>
      <li>
        <Text>disabled</Text>
        <Select
          disabled
          options={[
            { label: 'Apple', value: 'apple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Banana', value: 'banana' },
          ]}
        />
      </li>
      <li>
        <Text>placeholder</Text>
        <Select
          value=""
          options={[
            { label: 'Select fruit', value: '' },
            { label: 'Apple', value: 'apple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Banana', value: 'banana' },
          ]}
        />
      </li>
      <li>
        <Text>optgroup</Text>
        <Select
          value="orange"
          options={[
            { label: 'Select fruit', value: '' },
            { label: 'Apple', value: 'apple' },
            {
              label: 'citrus',
              options: [
                { label: 'Orange', value: 'orange' },
                { label: 'Lemon', value: 'lemon' },
                { label: 'Grapefruit', value: 'grapefruit' },
              ],
            },
            { label: 'Banana', value: 'banana' },
            {
              label: 'Fruit vegetables',
              disabled: true,
              options: [
                { label: 'Strawberry', value: 'strawberry' },
                { label: 'Melon', value: 'melon' },
                { label: 'Water melon', value: 'water melon' },
              ],
            },
          ]}
        />
      </li>
      <li>
        <Text>width</Text>
        <Select
          width="100%"
          options={[
            { label: 'apple', value: 'apple' },
            { label: 'orange', value: 'orange' },
            { label: 'banana', value: 'banana' },
          ]}
        />
      </li>
      <li>
        <Text>hasBlank</Text>
        <Select
          hasBlank
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
