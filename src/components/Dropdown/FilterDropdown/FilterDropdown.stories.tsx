import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react'
import React, { ComponentProps, ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../../Button'
import { MultiComboBox, SingleComboBox } from '../../ComboBox'
import { FormControl } from '../../FormControl'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { Fieldset } from '../../NewFieldset'
import { RadioButton } from '../../RadioButton'

import { FilterDropdown } from './FilterDropdown'

const meta = {
  title: 'Buttons（ボタン）/Dropdown',
  component: FilterDropdown,
  parameters: {
    withTheming: true,
  },
  excludeStories: ['Render'],
} satisfies Meta<typeof FilterDropdown>
export default meta

type Story = StoryObj<typeof meta>

export const Render: React.FC = () => {
  const [value, setValue] = React.useState('hoge')
  const [text, setText] = React.useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)
  const [isFiltered, setIsFiltered] = React.useState(false)
  const [isFiltered2, setIsFiltered2] = React.useState(true)
  const [isFiltered3, setIsFiltered3] = React.useState(true)
  const [isFiltered4, setIsFiltered4] = React.useState(true)
  const [responseMessage, setResponseMessage] =
    useState<ComponentProps<typeof FilterDropdown>['responseMessage']>()

  return (
    <Wrapper>
      <List>
        <dt>nonFiltered</dt>
        <dd>
          <FilterDropdown
            onApply={() => setIsFiltered(true)}
            onCancel={() => setIsFiltered(false)}
            onReset={() => {
              setValue('hoge')
              setText('')
            }}
            isFiltered={isFiltered}
          >
            <Fieldset
              title={
                <>
                  `FilterDropdown` provide specific interface to be able to filter data.
                  <br />
                  You can control inputs for filtering conditions as children components.
                </>
              }
            >
              <RadioButtonList>
                <li>
                  <RadioButton name="hoge" checked={value === 'hoge'} onChange={onChangeValue}>
                    hoge
                  </RadioButton>
                </li>
                <li>
                  <RadioButton name="fuga" checked={value === 'fuga'} onChange={onChangeValue}>
                    fuga
                  </RadioButton>
                </li>
                <li>
                  <RadioButton name="piyo" checked={value === 'piyo'} onChange={onChangeValue}>
                    piyo
                  </RadioButton>
                </li>
                <li>
                  <Input name="test" value={text} onChange={onChangeText} title="test" />
                </li>
              </RadioButtonList>
              <Description>
                ↓<br />↓
              </Description>
              <FormControl title="Children content is scrollable." role="group">
                <ActualSingleComboBox name="single" />
                <ActualMultiComboBox name="multi" />
              </FormControl>
            </Fieldset>
          </FilterDropdown>
        </dd>
        <dt>Filtered</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered2}
            onApply={() => setIsFiltered2(true)}
            onReset={() => setIsFiltered2(false)}
          >
            <p>You can change border color of the trigger button by setting `isFiltered`.</p>
          </FilterDropdown>
        </dd>
        <dt>Filtered has status text</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered3}
            onApply={() => setIsFiltered3(true)}
            onReset={() => setIsFiltered3(false)}
            hasStatusText
          >
            <p>
              You can change border text and color of the trigger button by setting `isFiltered`.
            </p>
          </FilterDropdown>
        </dd>
        <dt>disabled</dt>
        <dd>
          <FilterDropdown
            onApply={() => setIsFiltered(true)}
            onCancel={() => setIsFiltered(false)}
            onReset={() => {
              setValue('hoge')
              setText('')
            }}
            isFiltered={isFiltered}
            disabled
          >
            disabled
          </FilterDropdown>
        </dd>
        <dt>Custom text</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered4}
            onApply={() => setIsFiltered4(true)}
            onReset={() => setIsFiltered4(false)}
            hasStatusText
            decorators={{
              status: (txt) => <span data-wovn-enable="true">{`filtered.(${txt})`}</span>,
              triggerButton: (txt) => <span data-wovn-enable="true">{`filter.(${txt})`}</span>,
              applyButton: (txt) => <span data-wovn-enable="true">{`apply.(${txt})`}</span>,
              cancelButton: (txt) => <span data-wovn-enable="true">{`cancel.(${txt})`}</span>,
              resetButton: (txt) => <span data-wovn-enable="true">{`reset.(${txt})`}</span>,
            }}
          >
            <p>
              You can change border text and color of the trigger button by setting `isFiltered`.
            </p>
          </FilterDropdown>
        </dd>
        <dt>Has response message</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered4}
            onApply={() => setIsFiltered4(true)}
            onReset={() => setIsFiltered4(false)}
            responseMessage={responseMessage}
          >
            <Stack gap={1}>
              <p>
                You can change border text and color of the trigger button by setting `isFiltered`.
              </p>
              <p>切り替えボタン：</p>
              <Cluster gap={0.5}>
                <Button
                  onClick={() => {
                    setResponseMessage({ status: 'success', text: '適用しました。' })
                  }}
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    setResponseMessage({ status: 'error', text: '何らかのエラーが発生しました。' })
                  }}
                >
                  エラー
                </Button>
                <Button
                  onClick={() => {
                    setResponseMessage({ status: 'processing' })
                  }}
                >
                  保存中
                </Button>
              </Cluster>
            </Stack>
          </FilterDropdown>
        </dd>
        <dt>small button</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered2}
            onApply={() => setIsFiltered2(true)}
            onReset={() => setIsFiltered2(false)}
            triggerSize="s"
          >
            <p>You can change border color of the trigger button by setting `isFiltered`.</p>
          </FilterDropdown>
        </dd>
      </List>
    </Wrapper>
  )
}

export const FilterDropdownStory: Story = {
  name: 'FilterDropdown',
  args: {
    children: null,
  },
  render: () => <Render />,
}

const Wrapper = styled.div`
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
`
const List = styled.dl`
  margin: 0;
  dt {
    margin-bottom: 8px;
    &:not(:first-child) {
      margin-top: 24px;
    }
  }
  dd {
    margin: 0;
  }
`
const Description = styled.p`
  margin: 0;
  padding: 100px 0;
`
const RadioButtonList = styled.ul`
  list-style: none;
`

type Item = { label: ReactNode; value: string }
const ActualSingleComboBox: React.FC<{ name: string }> = ({ name }) => {
  const [items, _setItems] = useState([
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
      label:
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
      value: 'value-6',
    },
  ])
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
      name={name}
      items={items}
      selectedItem={selectedItem}
      defaultItem={items[0]}
      onSelect={handleSelectItem}
      onClear={handleClear}
    />
  )
}
const ActualMultiComboBox: React.FC<{ name: string }> = ({ name }) => {
  const [items, _setItems] = useState([
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
      label:
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
      value: 'value-6',
    },
  ])
  const [selectedItems, setSelectedItems] = useState<Item[]>([])

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

  return (
    <MultiComboBox
      name={name}
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
    />
  )
}
