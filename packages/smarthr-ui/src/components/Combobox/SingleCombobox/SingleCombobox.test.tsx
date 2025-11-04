import { render, screen, within } from '@testing-library/react'
import { type ComponentProps, act } from 'react'
import { userEvent } from 'storybook/test'

import { IntlProvider } from '../../../intl'
import { FormControl } from '../../FormControl'

import { SingleCombobox } from './SingleCombobox'

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
            items={
              items || [
                { label: 'option 1', value: 'value-1' },
                { label: 'option 2', value: 'value-2' },
                { label: 'option 3', value: 'value-3' },
                { label: 'option 4', value: 'value-4' },
                { label: 'option 5', value: 'value-5' },
              ]
            }
            selectedItem={
              selectedItem !== undefined ? selectedItem : { label: 'option 1', value: 'value-1' }
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
    await act(() => userEvent.click(combobox()))
    expect(combobox()).toHaveFocus()
    expect(screen.queryByRole('listbox')).toBeInTheDocument()

    // リストボックスからアイテムを選択して、選択イベントの発火を確認
    await act(() => userEvent.click(screen.getByRole('option', { name: 'option 2' })))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('アイテムを選択解除できること', async () => {
    const onClear = vi.fn()
    render(template({ onClear }))

    // 削除ボタンをクリックして削除イベントの発火を確認
    await act(() => userEvent.click(clearButton()))
    expect(onClear).toHaveBeenCalledWith()
  })

  it('リストボックスを開閉できること', async () => {
    render(template({}))

    // クリックで開く
    await act(() => userEvent.click(combobox()))
    expect(listbox()).toBeInTheDocument()

    // 外側クリックで閉じる
    await act(() => userEvent.click(document.body))
    expect(listbox()).not.toBeInTheDocument()

    // 再度クリックで開く
    await act(() => userEvent.click(combobox()))
    expect(listbox()).toBeInTheDocument()

    // ESCで閉じる
    await act(() => userEvent.keyboard('{escape}'))
    expect(listbox()).not.toBeInTheDocument()
  })

  it('コンボボックスがフォーカスされていないときに選択解除ボタンを押下してもリストボックスが表示されること', async () => {
    const onClear = vi.fn()
    render(template({ onClear }))

    // 選択解除ボタンをクリックしてリストボックスが表示されることを確認
    await act(() => userEvent.click(clearButton()))
    expect(listbox()).toBeInTheDocument()
  })

  it('新しいアイテムを追加できること', async () => {
    const onAdd = vi.fn()
    render(template({ onAdd, creatable: true, selectedItem: null }))

    // コンボボックスをクリックしてリストボックスを表示
    await act(() => userEvent.click(combobox()))
    expect(listbox()).toBeInTheDocument()

    // 新しいアイテムを入力する
    await act(() => userEvent.type(combobox(), '新しいアイテム'))
    expect(listbox()).toHaveTextContent('「新しいアイテム」を追加')

    // 新しいアイテムをクリックして、追加イベントの発火を確認
    await act(() =>
      userEvent.click(screen.getByRole('option', { name: '「新しいアイテム」を追加' })),
    )
    expect(onAdd).toHaveBeenCalledWith('新しいアイテム')
  })

  it('disabled なコンボボックスではアイテムの選択・解除ができないこと', async () => {
    const onClear = vi.fn()
    render(template({ onClear, disabled: true }))

    // コンボボックスをクリックしてもリストボックスが表示されないことを確認
    await act(() => userEvent.click(combobox()))
    expect(listbox()).not.toBeInTheDocument()

    // 選択解除ボタンが表示されていない(非表示用のクラスが付与されている)
    expect(clearButton()).toHaveClass('shr-hidden')
  })

  it('readOnly なコンボボックスではアイテムの選択・解除ができないこと', async () => {
    const onClear = vi.fn()
    render(template({ onClear, readOnly: true }))

    // コンボボックスをクリックしてもリストボックスが表示されないことを確認
    await act(() => userEvent.click(combobox()))
    expect(listbox()).not.toBeInTheDocument()

    // 選択解除ボタンが表示されていない(非表示用のクラスが付与されている)
    expect(clearButton()).toHaveClass('shr-hidden')
  })

  it('キーボードで操作できること', async () => {
    const onSelect = vi.fn()
    render(template({ onSelect, selectedItem: null }))

    await act(() => userEvent.keyboard('{tab}'))
    await act(() => userEvent.keyboard('{arrowdown}'))
    await act(() => userEvent.keyboard('{arrowdown}'))
    await act(() => userEvent.keyboard('{arrowdown}'))
    await act(() => userEvent.keyboard('{enter}'))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 3', value: 'value-3' })

    await act(() => userEvent.keyboard('{arrowup}'))
    await act(() => userEvent.keyboard('{arrowup}'))
    await act(() => userEvent.keyboard('{arrowup}'))
    await act(() => userEvent.keyboard('{arrowup}'))
    await act(() => userEvent.keyboard('{enter}'))
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
              items={[
                { label: 'option 1', value: 'value-1' },
                { label: 'option 2', value: 'value-2' },
              ]}
              selectedItem={{ label: 'option 1', value: 'value-1' }}
            />
          </FormControl>
        </form>
        ,
      </IntlProvider>,
    )

    await act(() => userEvent.keyboard('{tab}'))
    await act(() => userEvent.keyboard('{enter}'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

test('groupロールが付与されている', () => {
  const onClearClick = vi.fn()

  render(
    <IntlProvider locale="ja">
      <form>
        <FormControl label="コンボボックス">
          <SingleCombobox
            name="default"
            items={[
              { label: 'option 1', value: 'value-1' },
              { label: 'option 2', value: 'value-2' },
            ]}
            selectedItem={{ label: 'option 1', value: 'value-1' }}
            onClearClick={onClearClick}
          />
        </FormControl>
      </form>
    </IntlProvider>,
  )

  within(screen.getByRole('group')).getByRole('button', { name: 'クリア' }).click()
  expect(onClearClick).toBeCalled()
})
