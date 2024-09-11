import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ReactNode, useCallback, useState } from 'react'

import { FormControl } from '../FormControl'
import { Stack } from '../Layout'

import { SingleComboBox } from '.'

export default {
  title: 'Forms（フォーム）/SingleComboBox',
  component: SingleComboBox,
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

export const SingleCombobox: StoryFn = () => {
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

  const [itemsForDefault] = useState(defaultItems)
  const [selectedItemForDefault, setSelectedItemForDefault] = useState<Item | null>(null)

  const handleSelectItemForDefault = useCallback((item: Item) => {
    action('onSelect')(item)
    setSelectedItemForDefault(item)
  }, [])
  const handleClearForDefault = useCallback(() => {
    action('onClear')()
    setSelectedItemForDefault(null)
  }, [])

  return (
    <Stack>
      <FormControl title="デフォルト">
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
      </FormControl>
      <FormControl title="アイテム追加可能">
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
      </FormControl>
      <FormControl title="Disabled">
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
      </FormControl>
      <FormControl title="必須">
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
      </FormControl>
      <FormControl title="その他属性">
        <SingleComboBox
          name="inputAttributes"
          items={items}
          selectedItem={selectedItem}
          onSelect={handleSelectItem}
          onClear={handleClear}
          data-test="single-combobox-disabled"
          aria-label="inputAttributes"
        />
      </FormControl>
      <FormControl title="エラー表示">
        <SingleComboBox
          name="error"
          items={items}
          selectedItem={selectedItem}
          dropdownHelpMessage="入力でフィルタリングできます。"
          error
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </FormControl>
      <FormControl title="読込中">
        <SingleComboBox
          name="isLoading"
          items={items}
          selectedItem={selectedItem}
          dropdownHelpMessage="入力でフィルタリングできます。"
          isLoading
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </FormControl>
      <FormControl title="文言変更">
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
      </FormControl>
      <FormControl title="100%幅">
        <SingleComboBox
          name="widthFull"
          items={items}
          selectedItem={selectedItem}
          width="100%"
          dropdownHelpMessage="入力でフィルタリングできます。"
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </FormControl>
      <FormControl title="ドロップダウンリストの幅を指定(38文字)">
        <SingleComboBox
          name="dropdownWidth38em"
          items={items}
          selectedItem={selectedItem}
          dropdownWidth="38em"
          dropdownHelpMessage="入力でフィルタリングできます。（ダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキストダミーテキスト）"
          onSelect={handleSelectItem}
          onClear={handleClear}
        />
      </FormControl>
      <FormControl title="アイテム数が多い時">
        <SingleComboBox
          name="manyItems"
          items={manyItems}
          selectedItem={null}
          dropdownHelpMessage="入力でフィルタリングできます。"
          onSelect={action('onSelect')}
        />
      </FormControl>
      <FormControl title="クリアボタンクリック時のデフォルトの挙動を無効化">
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
      </FormControl>
      <FormControl title="デフォルトの選択肢あり">
        <SingleComboBox
          name="defaultItemSingleCombobox"
          items={itemsForDefault}
          selectedItem={selectedItemForDefault}
          defaultItem={itemsForDefault[0]}
          onSelect={handleSelectItemForDefault}
          onClear={handleClearForDefault}
        />
      </FormControl>
      <form
        onSubmit={() => {
          throw new Error('このsubmitは発火しません')
        }}
      >
        <FormControl title="form要素でラップした場合、選択肢をキーボードで選択してもformをsubmitしない">
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
        </FormControl>
      </form>
    </Stack>
  )
}
