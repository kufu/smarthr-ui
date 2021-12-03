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
  {
    label: 'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
    value: 'value-6',
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
          onChangeSelected={action('onChangeSelected')}
          data-test="single-combobox-default"
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
          data-test="single-combobox-creatable"
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
          data-test="single-combobox-disabled"
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
      <dt>アイテム数が多い時</dt>
      <dd>
        <SingleComboBox
          items={Array.from({ length: 5000 }).map((_, i) => ({
            label: String(i),
            value: String(i),
          }))}
          selectedItem={null}
          width={400}
          placeholder="入力でフィルタリングできます"
          onSelect={action('onSelect')}
        />
      </dd>
    </List>
  )
}

export const Multi: Story = () => {
  const [items, setItems] = useState(defaultItems)
  const [selectedItems, setSelectedItems] = useState<{
    default: Item[]
    creatable: Item[]
    disabled: Item[]
    error: Item[]
    tooltip: Item[]
    loading: Item[]
    undeletable: Item[]
    controllable: Item[]
    fullWidth: Item[]
  }>({
    default: [],
    creatable: [],
    disabled: [],
    error: [],
    tooltip: [],
    loading: [],
    undeletable: [],
    controllable: [],
    fullWidth: [],
  })
  const [seq, setSeq] = useState(0)
  const [controlledInputValue, setControlledInputValue] = useState<string>('')

  const handleSelectItem = useCallback(
    (key: keyof typeof selectedItems) => (item: Item) => {
      action('onSelect')(item)
      const oldSelected = selectedItems[key] || []
      setSelectedItems({
        ...selectedItems,
        [key]: [...oldSelected, item],
      })
    },
    [selectedItems],
  )
  const handleDelete = useCallback(
    (key: keyof typeof selectedItems) => (deleted: Item) => {
      action('onDelete')()
      setSelectedItems({
        ...selectedItems,
        [key]: selectedItems[key].filter((item) => item.value !== deleted.value),
      })
    },
    [selectedItems],
  )
  const handleAddItem = useCallback(
    (key: keyof typeof selectedItems) => (label: string) => {
      action('onAdd')(label)
      const newItem = {
        label,
        value: `new-value-${seq}`,
      }
      setItems([...items, newItem])
      const oldSelected = selectedItems[key] || []
      setSelectedItems({
        ...selectedItems,
        [key]: [...oldSelected, newItem],
      })
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
          selectedItems={selectedItems['default']}
          width={400}
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete('default')}
          onSelect={handleSelectItem('default')}
          onChangeSelected={action('onChangeSelected')}
          onFocus={action('onFocus')}
          onBlur={action('onBlur')}
          data-test="multi-combobox-default"
        />
      </dd>
      <dt>アイテム追加可能</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['creatable']}
          width={400}
          placeholder="新しいアイテムを追加できます"
          creatable
          onDelete={handleDelete('creatable')}
          onSelect={handleSelectItem('creatable')}
          onAdd={handleAddItem('creatable')}
          data-test="multi-combobox-creatable"
        />
      </dd>
      <dt>Disabled</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['disabled']}
          width={400}
          placeholder="Disabled なコンボボックス"
          disabled
          onDelete={handleDelete('disabled')}
          onSelect={handleSelectItem('disabled')}
          data-test="multi-combobox-disabled"
        />
      </dd>
      <dt>エラー表示</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['error']}
          width={400}
          placeholder="入力でフィルタリングできます"
          error
          onDelete={handleDelete('error')}
          onSelect={handleSelectItem('error')}
        />
      </dd>
      <dt>選択済みアイテムを省略表示 + ツールチップ</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['tooltip']}
          width={400}
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete('tooltip')}
          onSelect={handleSelectItem('tooltip')}
          selectedItemEllipsis
        />
      </dd>
      <dt>読込中</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['loading']}
          width={400}
          placeholder="入力でフィルタリングできます"
          isLoading
          onDelete={handleDelete('loading')}
          onSelect={handleSelectItem('loading')}
        />
      </dd>
      <dt>選択解除ボタンを非表示</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['undeletable'].map((item) => ({
            ...item,
            deletable: false,
          }))}
          width={400}
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete('undeletable')}
          onSelect={handleSelectItem('undeletable')}
        />
      </dd>
      <dt>テキストボックスの挙動を制御</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['controllable']}
          width={400}
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete('controllable')}
          onSelect={handleSelectItem('controllable')}
          inputValue={controlledInputValue}
          onChangeInput={(e) => {
            setControlledInputValue(e.target.value)
          }}
          onBlur={() => setControlledInputValue('')}
        />
      </dd>
      <dt>100%幅</dt>
      <dd>
        <MultiComboBox
          items={items}
          selectedItems={selectedItems['fullWidth']}
          width="100%"
          placeholder="入力でフィルタリングできます"
          onDelete={handleDelete('fullWidth')}
          onSelect={handleSelectItem('fullWidth')}
        />
      </dd>
      <dt>アイテム数が多い時</dt>
      <dd>
        <MultiComboBox
          items={Array.from({ length: 5000 }).map((_, i) => ({
            label: String(i),
            value: String(i),
          }))}
          selectedItems={[]}
          width={400}
          placeholder="入力でフィルタリングできます"
          onSelect={action('onSelect')}
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
