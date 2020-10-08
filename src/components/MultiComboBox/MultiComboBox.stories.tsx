import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React, { ComponentProps, useState } from 'react'
import styled from 'styled-components'

import { MultiComboBox } from './MultiComboBox'

const initialItems = [
  {
    label: '選択肢1',
    value: 'value-1',
  },
  {
    label: '選択肢2',
    value: 'value-2',
  },
  {
    label: '選択肢3',
    value: 'value-3',
  },
  {
    label: '選択肢4',
    value: 'value-4',
  },
  {
    label: '選択肢5 (deletable が true になる)',
    value: 'value-5',
  },
]

storiesOf('MultiComboBox', module).add('all', () => {
  const [id, setId] = useState(0)
  const [items, setItems] = useState<ComponentProps<typeof MultiComboBox>['items']>(initialItems)
  const [selectedItems, setSelectedItems] = useState<
    ComponentProps<typeof MultiComboBox>['selectedItems']
  >([])
  const [selectedItems2, setSelectedItems2] = useState<
    ComponentProps<typeof MultiComboBox>['selectedItems']
  >([
    {
      label: '選択肢1',
      value: 'value-1',
    },
    {
      label: '選択肢2',
      value: 'value-2',
    },
  ])

  return (
    <List>
      <li>
        <Txt>common</Txt>

        <MultiComboBox
          items={initialItems}
          selectedItems={selectedItems}
          placeholder="値を入力してください"
          width={400}
          onDelete={({ value }) => {
            setSelectedItems(selectedItems.filter((item) => item.value !== value))
          }}
          onSelect={({ value, label }) => {
            setSelectedItems([
              ...selectedItems,
              {
                value,
                label,
                deletable: value !== 'value-5',
              },
            ])
          }}
        />
      </li>
      <li>
        <Txt>creatable (`disabled` という名前で作成すると disabled が true になる)</Txt>

        <MultiComboBox
          items={items}
          selectedItems={selectedItems2}
          placeholder="値を入力してください"
          width={400}
          creatable
          onAdd={(label) => {
            setItems([
              ...items,
              {
                label: label,
                value: `new-value-${id}`,
                disabled: label === 'disabled',
              },
            ])
            setSelectedItems2([
              ...selectedItems2,
              {
                label,
                value: `new-value-${id}`,
              },
            ])
            setId(id + 1)
          }}
          onDelete={({ value }) => {
            setSelectedItems2(selectedItems2.filter((item) => item.value !== value))
          }}
          onSelect={({ value, label }) => {
            setSelectedItems2([
              ...selectedItems2,
              {
                value,
                label,
                deletable: value !== 'value-5',
              },
            ])
          }}
        />
      </li>
      <li>
        <Txt>Disabled</Txt>

        <MultiComboBox
          items={[]}
          selectedItems={[]}
          disabled
          width={400}
          onChange={action('onChange')}
          onAdd={action('onAdd')}
          onDelete={action('onDelete')}
          onSelect={action('onSelect')}
        />
      </li>
      <li>
        <Txt>error</Txt>

        <MultiComboBox
          items={[]}
          selectedItems={[]}
          placeholder="値を入力してください"
          error
          width={400}
          onChange={action('onChange')}
          onAdd={action('onAdd')}
          onDelete={action('onDelete')}
          onSelect={action('onSelect')}
        />
      </li>
    </List>
  )
})

const List = styled.ul`
  margin: 0;
  padding: 24px;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 24px;
  }
`
const Txt = styled.p`
  margin: 0;
  margin-bottom: 16px;
  padding: 0;
  font-size: 14px;
`
