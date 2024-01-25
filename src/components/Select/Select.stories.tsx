import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { FormControl } from '../FormControl'
import { Stack } from '../Layout'

import { Select } from './Select'

export default {
  title: 'Forms（フォーム）/Select',
  component: Select,
}

const options = [
  { label: '高齢任意加入被保険者', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: '評価業務担当者', value: 'banana' },
  { label: '書類に記載する従業員・扶養家族', value: 'melon', disabled: true },
]

export const All: StoryFn = () => (
  <ListStack>
    <li>
      <FormControl title="標準">
        <Select name="default" options={options} />
      </FormControl>
    </li>
    <li>
      <FormControl title="サイズ小">
        <Select name="s" options={options} size="s" />
      </FormControl>
    </li>
    <li>
      <FormControl title="value 指定">
        <Select name="value" value="orange" options={options} />
      </FormControl>
    </li>
    <li>
      <FormControl title="エラー状態">
        <Select name="error" error options={options} />
      </FormControl>
    </li>
    <li>
      <FormControl title="disabled 状態">
        <Select name="disabled" disabled options={options} />
      </FormControl>
    </li>
    <li>
      <FormControl title="選択肢グループ要素の使用">
        <Select
          name="group"
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
      </FormControl>
    </li>
    <li style={{ alignSelf: 'stretch' }}>
      <FormControl title="幅指定">
        <Select name="width" width="100%" options={options} />
      </FormControl>
    </li>
    <li>
      <FormControl title="空の選択肢を表示">
        <Select name="hasBlank" hasBlank options={options} />
      </FormControl>
    </li>
    <li>
      <FormControl title="空の選択肢を表示(文言も変更)">
        <Select
          name="hasBlank"
          hasBlank
          decorators={{ blankLabel: (txt) => `select.(${txt})` }}
          options={options}
        />
      </FormControl>
    </li>
    <li>
      <FormControl title="onChange">
        <Select
          name="onChange"
          onChange={action('onChange!!')}
          onChangeValue={action('onChangeValue')}
          options={[
            { label: 'apple', value: 'apple' },
            { label: 'orange', value: 'orange' },
            { label: 'banana', value: 'banana' },
            {
              label: 'Fruit vegetables',
              options: [
                { label: 'Strawberry', value: 'strawberry' },
                { label: 'Melon', value: 'melon' },
                { label: 'Water melon', value: 'water melon' },
              ],
            },
          ]}
        />
      </FormControl>
    </li>
  </ListStack>
)
All.storyName = 'all'

const ListStack = styled(Stack).attrs({ forwardedAs: 'ul', align: 'flex-start' })`
  list-style: none;
  padding: 0 24px;
`
