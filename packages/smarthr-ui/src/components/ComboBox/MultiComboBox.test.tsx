import { userEvent } from '@storybook/test'
import { render, screen } from '@testing-library/react'
import React, { ComponentProps, act } from 'react'

import { FormControl } from '../FormControl'

import { MultiComboBox } from './MultiComboBox'
import { SingleComboBox } from './SingleComboBox'

describe('SingleComboBox', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  const combobox = () => screen.getByRole('combobox', { name: 'コンボボックス' })
  const listbox = () => screen.queryByRole('listbox')
  const deleteButtons = () => screen.getAllByRole('button', { name: '削除' })

  const template = (args: Partial<ComponentProps<typeof MultiComboBox>>) => (
    <form>
      <FormControl title="コンボボックス">
        <MultiComboBox
          name="default"
          items={[
            { label: 'option 1', value: 'value-1' },
            { label: 'option 2', value: 'value-2' },
            { label: 'option 3', value: 'value-3' },
            { label: 'option 4', value: 'value-4' },
            { label: 'option 5', value: 'value-5' },
          ]}
          selectedItems={[{ label: 'option 1', value: 'value-1' }]}
          // eslint-disable-next-line smarthr/jsx-start-with-spread-attributes
          {...args}
        />
      </FormControl>
    </form>
  )

  it('アイテムを選択できること', async () => {
    const onSelect = vi.fn()
    render(template({ onSelect }))

    // コンボボックスをクリックしてリストボックスを表示
    await act(() => userEvent.click(combobox()))
    expect(combobox()).toHaveFocus()
    expect(screen.queryByRole('listbox')).toBeInTheDocument()

    // リストボックスからアイテムを2種続けて選択して、選択イベントの発火を確認
    await act(() => userEvent.click(screen.getByRole('option', { name: 'option 2' })))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
    await act(() => userEvent.click(screen.getByRole('option', { name: 'option 4' })))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 4', value: 'value-4' })

    // リストボックスは開かれたままになっている
    expect(screen.queryByRole('listbox')).toBeInTheDocument()
  })

  it('アイテムを選択解除できること', async () => {
    const onDelete = vi.fn()
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1' },
          { label: 'option 3', value: 'value-3' },
        ],
        onDelete,
      }),
    )

    // 削除ボタンをクリックすると、クリックしたアイテムが onDelete で渡される
    await act(() => userEvent.click(deleteButtons()[0]))
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 1', value: 'value-1' })
    await act(() => userEvent.click(deleteButtons()[1]))
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 3', value: 'value-3' })
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

  it('コンボボックスがフォーカスされていないときに選択解除ボタンを押下してもリストボックスが表示されないこと', async () => {
    const onDelete = vi.fn()
    render(template({ onDelete }))

    // 選択解除ボタンをクリックしてもリストボックスが表示されないことを確認
    await act(() => userEvent.click(deleteButtons()[0]))
    expect(listbox()).not.toBeInTheDocument()
  })

  it('新しいアイテムを追加できること', async () => {
    const onAdd = vi.fn()
    render(template({ onAdd, creatable: true, selectedItems: [] }))

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

  it('deletable でないコンボボックスアイテムは削除できないこと', async () => {
    const onDelete = vi.fn()
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1', deletable: false },
          { label: 'option 2', value: 'value-2', deletable: true },
          { label: 'option 3', value: 'value-3', deletable: false },
        ],
        onDelete,
      }),
    )

    // 選択中のアイテムは3つあるが、削除ボタンは1つしか表示されていない
    expect(deleteButtons()).toHaveLength(1)

    // その1つをクリックした場合、deletable なアイテムで onDelete が呼ばれる
    await act(() => userEvent.click(deleteButtons()[0]))
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2', deletable: true })
  })

  it('disabled なコンボボックスではアイテムの選択・解除ができないこと', async () => {
    const onDelete = vi.fn()
    render(template({ onDelete, disabled: true }))

    // コンボボックスをクリックしてもリストボックスが表示されないことを確認
    await act(() => userEvent.click(combobox()))
    expect(listbox()).not.toBeInTheDocument()

    // 選択解除ボタンをクリックしても onDelete が呼ばれないことを確認
    await act(() => userEvent.click(deleteButtons()[0]))
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('キーボードでリストボックスからアイテムを追加できること', async () => {
    const onSelect = vi.fn()
    render(template({ onSelect, selectedItems: [] }))

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
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 4', value: 'value-4' })
  })

  it('キーボードでリストボックスからアイテムを削除できること', async () => {
    const onDelete = vi.fn()
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1' },
          { label: 'option 2', value: 'value-2' },
          { label: 'option 3', value: 'value-3' },
        ],
        onDelete,
      }),
    )

    // リストボックスを開く
    await act(() => userEvent.keyboard('{tab}'))

    // 下矢印キーで選択中アイテムに移動し、Enter キーで削除できること
    await act(() => userEvent.keyboard('{arrowdown}'))
    await act(() => userEvent.keyboard('{enter}'))
    await act(() => userEvent.keyboard('{arrowdown}'))
    await act(() => userEvent.keyboard('{enter}'))
    await act(() => userEvent.keyboard('{arrowdown}'))
    await act(() => userEvent.keyboard('{enter}'))
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 1', value: 'value-1' })
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 3', value: 'value-3' })
  })

  it('キーボードで選択中アイテムのフォーカス移動ができること', async () => {
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1' },
          { label: 'option 2', value: 'value-2' },
          { label: 'option 3', value: 'value-3' },
        ],
      }),
    )

    // リストボックスを開く
    await act(() => userEvent.keyboard('{tab}'))

    // 適当にキー入力
    await act(() => userEvent.keyboard('ops'))

    // カーソルを左に移動をしても、キャレットがテキストの先頭にない間は削除ボタンにフォーカスが移動しないこと
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[2]).not.toHaveFocus()
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[2]).not.toHaveFocus()
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[2]).not.toHaveFocus()

    // キャレットが先頭にある状態でカーソルを左に移動すると、末尾の削除ボタンにフォーカスが移動すること
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[2]).toHaveFocus()

    // 削除ボタンにフォーカスがある状態でさらに手前の削除ボタンに移動できること
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[1]).toHaveFocus()
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[0]).toHaveFocus()

    // 一番手前の削除ボタンにフォーカスがある場合は、左矢印キーを押下してもこれ以上フォーカス移動できないこと
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[0]).toHaveFocus()

    // 末尾日の削除ボタンにフォーカスがある場合、右矢印キーを押下すると input いフォーカスが移動すること
    await act(() => userEvent.keyboard('{arrowright}'))
    await act(() => userEvent.keyboard('{arrowright}'))
    await act(() => userEvent.keyboard('{arrowright}'))
    expect(deleteButtons()[2]).not.toHaveFocus()
    expect(combobox()).toHaveFocus()
  })

  it('キーボードで選択中アイテムにフォーカス移動して削除できること', async () => {
    const onDelete = vi.fn()
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1' },
          { label: 'option 2', value: 'value-2' },
        ],
        onDelete,
      }),
    )

    // リストボックスを開く
    await act(() => userEvent.keyboard('{tab}'))

    // 選択中のアイテムにフォーカスを移動
    await act(() => userEvent.keyboard('{arrowleft}'))
    expect(deleteButtons()[1]).toHaveFocus()

    // Enter キーで削除
    await act(() => userEvent.keyboard('{enter}'))
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
  })

  it('Backspaceキーでアイテムを削除できること', async () => {
    const onDelete = vi.fn()
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1' },
          { label: 'option 2', value: 'value-2' },
        ],
        onDelete,
      }),
    )

    // リストボックスを開く
    await act(() => userEvent.keyboard('{tab}'))

    // Backspace キーで末尾のアイテムが削除されること
    await act(() => userEvent.keyboard('{backspace}'))
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })

    // Backspace によって削除した末尾アイテムはテキスト化されること
    expect(combobox()).toHaveValue('option 2')
  })
})
