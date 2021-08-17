import { Story } from '@storybook/react'
import React, { useCallback, useState } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import { MultiComboBox, SingleComboBox } from '.'

import readme from './README.md'

export default {
  title: 'ComboBox',
  component: SingleComboBox,
  subcomponents: { MultiComboBox },
  parameters: {
    docs: {
      description: { component: readme },
      source: { type: 'dynamic' },
    },
  },
}

const defaultItems = [
  {
    label: 'option 1',
    value: 'value-1',
    data: {
      name: 'test',
      age: 23,
    },
  },
  {
    label: 'option 2',
    value: 'value-2',
    data: {
      name: 'test 2',
      age: 34,
    },
  },
  {
    label: 'option 3',
    value: 'value-3',
    disabled: true,
  },
  {
    label: 'option 4',
    value: 'value-4',
  },
  {
    label: 'option 5',
    value: 'value-5',
  },
]

type Item = { label: string; value: string }

export const Single: Story = () => {
  const [items, setItems] = useState(defaultItems)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [seq, setSeq] = useState(0)

  const handleSelectItem = useCallback((item: Item) => {
    action('onSelect')(item)
    setSelectedItem(item)
  }, [])
  const handleClear = useCallback(() => {
    action('onClear')()
    setSelectedItem(null)
  }, [])
  const handleAddItem = useCallback(
    (label: string) => {
      action('onAdd')(label)
      const newItem = {
        label,
        value: `new-value-${seq}`,
      }
      setItems([...items, newItem])
      setSelectedItem(newItem)
      setSeq(seq + 1)
    },
    [items, seq],
  )

  return (
    <List>
      <dt>デフォルト</dt>
      <dd>
        <SingleComboBox
          items={items}
          selectedItem={selectedItem}
          width={400}
          placeholder="入力でフィルタリングできます"
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </dd>
      <dt>アイテム追加可能</dt>
      <dd>
        <SingleComboBox
          items={items}
          selectedItem={selectedItem}
          width={400}
          placeholder="新しいアイテムを追加できます"
          creatable
          onSelect={handleSelectItem}
          onClear={handleClear}
          onAdd={handleAddItem}
        />
      </dd>
      <dt>Disabled</dt>
      <dd>
        <SingleComboBox
          items={items}
          selectedItem={selectedItem}
          width={400}
          placeholder="Disabled なコンボボックス"
          disabled
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </dd>
      <dt>エラー表示</dt>
      <dd>
        <SingleComboBox
          items={items}
          selectedItem={selectedItem}
          width={400}
          placeholder="入力でフィルタリングできます"
          error
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </dd>
      <dt>読込中</dt>
      <dd>
        <SingleComboBox
          items={items}
          selectedItem={selectedItem}
          width={400}
          placeholder="入力でフィルタリングできます"
          isLoading
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </dd>
      <dt>100%幅</dt>
      <dd>
        <SingleComboBox
          items={items}
          selectedItem={selectedItem}
          width="100%"
          placeholder="入力でフィルタリングできます"
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </dd>
    </List>
  )
}

export const Multi: Story = () => {
  const [items, setItems] = useState(defaultItems)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [seq, setSeq] = useState(0)

  const handleSelectItem = useCallback(
    (item: Item) => {
      action('onSelect')(item)
      setSelectedItems([...selectedItems, item])
    },
    [selectedItems],
  )
  const handleDelete = useCallback(
    (deleted) => {
      action('onDelete')()
      setSelectedItems(selectedItems.filter((item) => item.value !== deleted.value))
    },
    [selectedItems],
  )
  const handleAddItem = useCallback(
    (label: string) => {
      action('onAdd')(label)
      const newItem = {
        label,
        value: `new-value-${seq}`,
      }
      setItems([...items, newItem])
      setSelectedItems([...selectedItems, newItem])
      setSeq(seq + 1)
    },
    [items, selectedItems, seq],
  )

  return (
    <List>
      <dt>デフォルト</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems}
          width={400}
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete}
          onSelect={handleSelectItem}
        />
      </dd>
      <dt>アイテム追加可能</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems}
          width={400}
          placeholder="新しいアイテムを追加できます"
          creatable
          onDelete={handleDelete}
          onSelect={handleSelectItem}
          onAdd={handleAddItem}
        />
      </dd>
      <dt>Disabled</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems}
          width={400}
          placeholder="Disabled なコンボボックス"
          disabled
          onDelete={handleDelete}
          onSelect={handleSelectItem}
        />
      </dd>
      <dt>エラー表示</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems}
          width={400}
          placeholder="入力でフィルタリングできます"
          error
          onDelete={handleDelete}
          onSelect={handleSelectItem}
        />
      </dd>
      <dt>読込中</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems}
          width={400}
          placeholder="入力でフィルタリングできます"
          isLoading
          onDelete={handleDelete}
          onSelect={handleSelectItem}
        />
      </dd>
      <dt>選択解除ボタンを非表示</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems.map((item) => ({ ...item, deletable: false }))}
          width={400}
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete}
          onSelect={handleSelectItem}
        />
      </dd>
      <dt>100%幅</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems}
          width="100%"
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete}
          onSelect={handleSelectItem}
        />
      </dd>
    </List>
  )
}

const List = styled.dl`
  margin: 1rem 1.5rem;
  dd {
    margin: 1rem 0 2rem;
  }
`
