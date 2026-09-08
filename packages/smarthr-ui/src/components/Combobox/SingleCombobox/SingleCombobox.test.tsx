import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { IntlProvider } from '../../../intl'
import { FormControl } from '../../FormGroup'

import { SingleCombobox } from './SingleCombobox'

import type { ComboboxItem } from '../types'
import type { ComponentProps } from 'react'

describe('SingleCombobox', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  const combobox = () => screen.getByRole('combobox', { name: 'コンボボックス' })
  const listbox = () => screen.queryByRole('listbox')
  const clearButton = () => screen.getByRole('button', { name: 'クリア' })

  const template = ({
    name,
    items,
    selectedItem,
    ...rest
  }: Partial<ComponentProps<typeof SingleCombobox>>) => (
    <IntlProvider locale="ja">
      <form>
        <FormControl label="コンボボックス">
          <SingleCombobox
            {...rest}
            name={name || 'default'}
            selectedItem={
              selectedItem !== undefined ? selectedItem : { label: 'option 1', value: 'value-1' }
            }
            items={
              items || [
                { label: 'option 1', value: 'value-1' },
                { label: 'option 2', value: 'value-2' },
                { label: 'option 3', value: 'value-3' },
                { label: 'option 4', value: 'value-4' },
                { label: 'option 5', value: 'value-5' },
              ]
            }
          />
        </FormControl>
      </form>
    </IntlProvider>
  )

  it('アイテムを選択できること', async () => {
    const onSelect = vi.fn()
    render(template({ onSelect }))

    // コンボボックスをクリックしてリストボックスを表示
    await userEvent.click(combobox())
    expect(combobox()).toHaveFocus()
    expect(screen.queryByRole('listbox')).toBeInTheDocument()

    // リストボックスからアイテムを選択して、選択イベントの発火を確認
    await userEvent.click(screen.getByRole('option', { name: 'option 2' }))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('アイテムを選択解除できること', async () => {
    const onClear = vi.fn()
    render(template({ onClear }))

    // 削除ボタンをクリックして削除イベントの発火を確認
    await userEvent.click(clearButton())
    expect(onClear).toHaveBeenCalledWith()
  })

  it('リストボックスを開閉できること', async () => {
    render(template({}))

    // クリックで開く
    await userEvent.click(combobox())
    expect(listbox()).toBeInTheDocument()

    // 外側クリックで閉じる
    await userEvent.click(document.body)
    expect(listbox()).not.toBeInTheDocument()

    // 再度クリックで開く
    await userEvent.click(combobox())
    expect(listbox()).toBeInTheDocument()

    // ESCで閉じる
    await userEvent.keyboard('{escape}')
    expect(listbox()).not.toBeInTheDocument()
  })

  it('コンボボックスがフォーカスされていないときに選択解除ボタンを押下してもリストボックスが表示されること', async () => {
    const onClear = vi.fn()
    render(template({ onClear }))

    // 選択解除ボタンをクリックしてリストボックスが表示されることを確認
    await userEvent.click(clearButton())
    expect(listbox()).toBeInTheDocument()
  })

  it('新しいアイテムを追加できること', async () => {
    const onAdd = vi.fn()
    render(template({ onAdd, creatable: true, selectedItem: null }))

    // コンボボックスをクリックしてリストボックスを表示
    await userEvent.click(combobox())
    expect(listbox()).toBeInTheDocument()

    // 新しいアイテムを入力する
    await userEvent.type(combobox(), '新しいアイテム')
    expect(listbox()).toHaveTextContent('「新しいアイテム」を追加')

    // 新しいアイテムをクリックして、追加イベントの発火を確認
    await userEvent.click(screen.getByRole('option', { name: '「新しいアイテム」を追加' }))
    expect(onAdd).toHaveBeenCalledWith('新しいアイテム')
  })

  it('creatableで新しく追加したアイテムをselectedItemに指定すると、値・表示が更新されること', async () => {
    const initialItems: Array<ComboboxItem<string>> = [
      { label: 'option 1', value: 'value-1' },
      { label: 'option 2', value: 'value-2' },
    ]

    // 実際の利用方法を模して、親コンポーネントがitems・selectedItemを状態として管理し、
    // onAddで追加された値をitemsに加えた上でselectedItemに指定する
    const CreatableComboboxWrapper = () => {
      const [items, setItems] = useState(initialItems)
      const [selectedItem, setSelectedItem] = useState<ComboboxItem<string> | null>(null)

      return (
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <SingleCombobox
                name="default"
                selectedItem={selectedItem}
                creatable
                onAdd={(value) => {
                  const newItem = { label: value, value }
                  setItems((current) => [...current, newItem])
                  setSelectedItem(newItem)
                }}
                onChangeSelected={setSelectedItem}
                items={items}
              />
            </FormControl>
            {/* 手入力を経由せず外部からselectedItemを差し替えるための操作(実際のアプリでの「別のUIから選択を変更する」相当) */}
            <button
              type="button"
              onClick={() => setSelectedItem(items.find((item) => item.value === 'value-1')!)}
            >
              option 1を外部から選択
            </button>
          </form>
        </IntlProvider>
      )
    }

    render(<CreatableComboboxWrapper />)

    await userEvent.click(combobox())
    await userEvent.type(combobox(), '新しいアイテム')
    await userEvent.click(screen.getByRole('option', { name: '「新しいアイテム」を追加' }))

    // 追加したアイテムがinputの表示値として反映される
    expect(combobox()).toHaveValue('新しいアイテム')

    // 再度リストボックスを開くと、追加したアイテムが選択肢として一覧に含まれ、選択中(aria-selected)であること
    await userEvent.click(combobox())
    expect(screen.getByRole('option', { name: '新しいアイテム' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // 手入力を経由せず外部からselectedItemが変わった場合も、inputの表示値が正しく更新されること
    // (レンダー中の同期処理が効いているかの確認になる)
    await userEvent.click(screen.getByRole('button', { name: 'option 1を外部から選択' }))
    expect(combobox()).toHaveValue('option 1')
  })

  it('disabled なコンボボックスではアイテムの選択・解除ができないこと', async () => {
    const onClear = vi.fn()
    render(template({ onClear, disabled: true }))

    // コンボボックスをクリックしてもリストボックスが表示されないことを確認
    await userEvent.click(combobox())
    expect(listbox()).not.toBeInTheDocument()

    // 選択解除ボタンが表示されていない(data-clear-button-hidden属性がtrueになっている)
    expect(screen.getByRole('group')).toHaveAttribute('data-clear-button-hidden', 'true')
  })

  it('readOnly なコンボボックスではアイテムの選択・解除ができないこと', async () => {
    const onClear = vi.fn()
    render(template({ onClear, readOnly: true }))

    // コンボボックスをクリックしてもリストボックスが表示されないことを確認
    await userEvent.click(combobox())
    expect(listbox()).not.toBeInTheDocument()

    // 選択解除ボタンが表示されていない(data-clear-button-hidden属性がtrueになっている)
    expect(screen.getByRole('group')).toHaveAttribute('data-clear-button-hidden', 'true')
  })

  it('キーボードで操作できること', async () => {
    const onSelect = vi.fn()
    render(template({ onSelect, selectedItem: null }))

    await userEvent.keyboard('{tab}')
    await userEvent.keyboard('{arrowdown}')
    await userEvent.keyboard('{arrowdown}')
    await userEvent.keyboard('{arrowdown}')
    await userEvent.keyboard('{enter}')
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 3', value: 'value-3' })

    await userEvent.keyboard('{arrowup}')
    await userEvent.keyboard('{arrowup}')
    await userEvent.keyboard('{arrowup}')
    await userEvent.keyboard('{arrowup}')
    await userEvent.keyboard('{enter}')
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
  })

  it('キーボードで操作しても親要素のformがsubmitされないこと', async () => {
    const onSubmit = vi.fn()
    render(
      <IntlProvider locale="ja">
        <form onSubmit={onSubmit}>
          <FormControl label="コンボボックス">
            <SingleCombobox
              name="default"
              selectedItem={{ label: 'option 1', value: 'value-1' }}
              items={[
                { label: 'option 1', value: 'value-1' },
                { label: 'option 2', value: 'value-2' },
              ]}
            />
          </FormControl>
        </form>
        ,
      </IntlProvider>,
    )

    await userEvent.keyboard('{tab}')
    await userEvent.keyboard('{enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

test('groupロールが付与されている', async () => {
  const onClearClick = vi.fn()

  render(
    <IntlProvider locale="ja">
      <form>
        <FormControl label="コンボボックス">
          <SingleCombobox
            name="default"
            selectedItem={{ label: 'option 1', value: 'value-1' }}
            onClearClick={onClearClick}
            items={[
              { label: 'option 1', value: 'value-1' },
              { label: 'option 2', value: 'value-2' },
            ]}
          />
        </FormControl>
      </form>
    </IntlProvider>,
  )

  await userEvent.click(within(screen.getByRole('group')).getByRole('button', { name: 'クリア' }))
  expect(onClearClick).toBeCalled()
})
