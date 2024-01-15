import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'

import { Stack } from '../Layout'

import { MultiComboBox, SingleComboBox } from '.'

export default {
  title: 'Forms（フォーム）/ComboBox',
  component: SingleComboBox,
  subcomponents: { MultiComboBox },
  parameters: {
    docs: {
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
  {
    label: (
      <Stack as="span" gap={0.25}>
        <span>アイテムのラベルがReactNodeの場合</span>
        <span>（ダミーテキストダミーテキストダミーテキストダミーテキスト）</span>
      </Stack>
    ),
    value: 'value-7',
  },
]

const manyItems = Array.from({ length: 2000 }).map((_, i) => ({
  label: `option ${i}`,
  value: `option ${i}`,
}))

type Item = { label: ReactNode; value: string; disabled?: boolean; data?: any }

export const Single: StoryFn = () => {
  const [items, setItems] = useState<Item[]>(defaultItems)
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
        value: label,
      }
      setItems([...items, newItem])
      setSelectedItem(newItem)
      setSeq(seq + 1)
    },
    [items, seq],
  )

  return (
    <List>
      <Stack>
        <dt>デフォルト</dt>
        <dd>
          <SingleComboBox
            name="default"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onSelect={handleSelectItem}
            onClear={handleClear}
            onChangeSelected={(item) => {
              action('onChangeSelected')(item)
              setSelectedItem(item)
            }}
            onFocus={action('onFocus')}
            onBlur={action('onBlur')}
            data-test="single-combobox-default"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>アイテム追加可能</dt>
        <dd>
          <SingleComboBox
            name="onAdd"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="新しいアイテムを追加できます。"
            creatable
            onSelect={handleSelectItem}
            onClear={handleClear}
            onAdd={handleAddItem}
            data-test="single-combobox-creatable"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>Disabled</dt>
        <dd>
          <SingleComboBox
            name="disabled"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="Disabled なコンボボックス"
            disabled
            onSelect={handleSelectItem}
            onClear={handleClear}
            data-test="single-combobox-disabled"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>必須</dt>
        <dd>
          <SingleComboBox
            name="required"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="Required なコンボボックス"
            required
            onSelect={handleSelectItem}
            onClear={handleClear}
            data-test="single-combobox-disabled"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>その他属性</dt>
        <dd>
          <SingleComboBox
            name="inputAttributes"
            items={items}
            selectedItem={selectedItem}
            inputAttributes={{
              'aria-label': 'inputAttributes',
            }}
            onSelect={handleSelectItem}
            onClear={handleClear}
            data-test="single-combobox-disabled"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>エラー表示</dt>
        <dd>
          <SingleComboBox
            name="error"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="入力でフィルタリングできます。"
            error
            onSelect={handleSelectItem}
            onClear={handleClear}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>読込中</dt>
        <dd>
          <SingleComboBox
            name="isLoading"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="入力でフィルタリングできます。"
            isLoading
            onSelect={handleSelectItem}
            onClear={handleClear}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>文言変更</dt>
        <dd>
          <SingleComboBox
            name="decorator"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onSelect={handleSelectItem}
            onClear={handleClear}
            decorators={{
              noResultText: (text) => `no result.(${text})`,
              destroyButtonIconAlt: (text) => `destroy.(${text})`,
            }}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>100%幅</dt>
        <dd>
          <SingleComboBox
            name="widthFull"
            items={items}
            selectedItem={selectedItem}
            width="100%"
            dropdownHelpMessage="入力でフィルタリングできます。"
            onSelect={handleSelectItem}
            onClear={handleClear}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>ドロップダウンリストの幅を指定(38文字)</dt>
        <dd>
          <SingleComboBox
            name="dropdownWidth38em"
            items={items}
            selectedItem={selectedItem}
            dropdownWidth="38em"
            dropdownHelpMessage="入力でフィルタリングできます。（ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト）"
            onSelect={handleSelectItem}
            onClear={handleClear}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>アイテム数が多い時</dt>
        <dd>
          <SingleComboBox
            name="manyItems"
            items={manyItems}
            selectedItem={null}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onSelect={action('onSelect')}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>クリアボタンクリック時のデフォルトの挙動を無効化</dt>
        <dd>
          <SingleComboBox
            name="onClearClick"
            items={items}
            selectedItem={selectedItem}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onSelect={handleSelectItem}
            onClearClick={(e) => {
              e.preventDefault()
              handleClear()
            }}
            onChangeSelected={(item) => {
              action('onChangeSelected')(item)
              setSelectedItem(item)
            }}
            data-test="single-combobox-default"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>デフォルトの選択肢あり</dt>
        <dd>
          <SingleWithDefaultItem />
        </dd>
      </Stack>
      <Stack>
        <dt>form要素でラップした場合、選択肢をキーボードで選択してもformをsubmitしない</dt>
        <dd>
          <form
            onSubmit={() => {
              throw new Error('このsubmitは発火しません')
            }}
          >
            <SingleComboBox
              name="inForm"
              items={items}
              selectedItem={selectedItem}
              dropdownHelpMessage="キーボードで選択肢を選んでもformはsubmitされません"
              onSelect={handleSelectItem}
              onChangeSelected={(item) => {
                action('onChangeSelected')(item)
                setSelectedItem(item)
              }}
              data-test="single-combobox-no-form-submit"
            />
          </form>
        </dd>
      </Stack>
    </List>
  )
}

const SingleWithDefaultItem: React.VFC = () => {
  const [items, _setItems] = useState(defaultItems)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const handleSelectItem = useCallback((item: Item) => {
    action('onSelect')(item)
    setSelectedItem(item)
  }, [])
  const handleClear = useCallback(() => {
    action('onClear')()
    setSelectedItem(null)
  }, [])

  return (
    <SingleComboBox
      name="default_item"
      items={items}
      selectedItem={selectedItem}
      defaultItem={items[0]}
      onSelect={handleSelectItem}
      onClear={handleClear}
    />
  )
}

export const Multi: StoryFn = () => {
  const [items, setItems] = useState<Item[]>(defaultItems)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [seq, setSeq] = useState(0)
  const [controlledInputValue, setControlledInputValue] = useState<string>('')

  const handleSelectItem = useCallback(
    (item: Item) => {
      action('onSelect')(item)
      setSelectedItems([...selectedItems, item])
    },
    [selectedItems],
  )
  const handleDelete = useCallback(
    (deleted: Item) => {
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
        value: label,
      }
      setItems([...items, newItem])
      setSelectedItems([...selectedItems, newItem])
      setSeq(seq + 1)
    },
    [items, selectedItems, seq],
  )

  return (
    <List gap={2}>
      <Stack>
        <dt>デフォルト</dt>
        <dd>
          <MultiComboBox
            name="default"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            onChangeSelected={(selected) => {
              action('onChangeSelected')(selected)
              setSelectedItems(selected)
            }}
            onFocus={action('onFocus')}
            onBlur={action('onBlur')}
            data-test="multi-combobox-default"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>アイテム追加可能</dt>
        <dd>
          <MultiComboBox
            name="onAdd"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="新しいアイテムを追加できます。"
            creatable
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            onAdd={handleAddItem}
            data-test="multi-combobox-creatable"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>Disabled</dt>
        <dd>
          <MultiComboBox
            name="disabled"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="Disabled なコンボボックス"
            disabled
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            data-test="multi-combobox-disabled"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>必須</dt>
        <dd>
          <MultiComboBox
            name="required"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="Required なコンボボックス"
            required
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            data-test="multi-combobox-disabled"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>その他属性</dt>
        <dd>
          <MultiComboBox
            name="inputAttributes"
            items={items}
            selectedItems={selectedItems}
            inputAttributes={{
              'aria-label': 'inputAttributes',
            }}
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            data-test="multi-combobox-disabled"
          />
        </dd>
      </Stack>
      <Stack>
        <dt>エラー表示</dt>
        <dd>
          <MultiComboBox
            name="error"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="入力でフィルタリングできます。"
            error
            onDelete={handleDelete}
            onSelect={handleSelectItem}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>選択済みアイテムを省略表示 + ツールチップ</dt>
        <dd>
          <MultiComboBox
            name="selectedItemEllipsis"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            selectedItemEllipsis
          />
        </dd>
      </Stack>
      <Stack>
        <dt>読込中</dt>
        <dd>
          <MultiComboBox
            name="isLoading"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="入力でフィルタリングできます。"
            isLoading
            onDelete={handleDelete}
            onSelect={handleSelectItem}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>文言変更</dt>
        <dd>
          <MultiComboBox
            name="decorator"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="入力でフィルタリングできます"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            decorators={{
              noResultText: (text) => `no result.(${text})`,
              destroyButtonIconAlt: (text) => `destroy.(${text})`,
              selectedListAriaLabel: (text) => `selected item list.(${text})`,
            }}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>選択解除ボタンを非表示</dt>
        <dd>
          <MultiComboBox
            name="invisible_unselected_button"
            items={items}
            selectedItems={selectedItems.map((item) => ({ ...item, deletable: false }))}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>テキストボックスの挙動を制御</dt>
        <dd>
          <MultiComboBox
            name="textbox_controllable"
            items={items}
            selectedItems={selectedItems}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
            onChangeSelected={(selected) => {
              action('onChangeSelected')(selected)
              setSelectedItems(selected)
            }}
            inputValue={controlledInputValue}
            onChangeInput={(e) => {
              setControlledInputValue(e.target.value)
            }}
            onBlur={() => setControlledInputValue('')}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>100%幅</dt>
        <dd>
          <MultiComboBox
            name="widthFull"
            items={items}
            selectedItems={selectedItems}
            width="100%"
            dropdownHelpMessage="入力でフィルタリングできます。"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>ドロップダウンリストの幅を指定(38文字)</dt>
        <dd>
          <MultiComboBox
            name="dropdownWidth38em"
            items={items}
            selectedItems={selectedItems}
            dropdownWidth="38em"
            dropdownHelpMessage="入力でフィルタリングできます"
            onDelete={handleDelete}
            onSelect={handleSelectItem}
          />
        </dd>
      </Stack>
      <Stack>
        <dt>アイテム数が多い時</dt>
        <dd>
          <MultiComboBox
            name="manyItems"
            items={manyItems}
            selectedItems={[]}
            dropdownHelpMessage="入力でフィルタリングできます。"
            onSelect={action('onSelect')}
            data-test="multi-combobox-many"
          />
        </dd>
      </Stack>
    </List>
  )
}

const List = styled(Stack).attrs({ forwardedAs: 'dl', gap: 2 })`
  margin: 1rem 1.5rem;
`
