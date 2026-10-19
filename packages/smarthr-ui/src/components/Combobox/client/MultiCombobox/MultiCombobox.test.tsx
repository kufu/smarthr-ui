import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProvider } from '../../../../intl'
import { FormControl } from '../../../FormGroup'

import { MultiCombobox } from './MultiCombobox'

import type { ComponentPropsWithRef } from 'react'

describe('SingleCombobox', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  const combobox = () => screen.getByRole('combobox', { name: 'コンボボックス' })
  const listbox = () => screen.queryByRole('listbox')
  const deleteButtons = () => screen.getAllByRole('button', { name: /を削除$/ })

  const template = ({
    name,
    items,
    selectedItems,
    ...rest
  }: Partial<ComponentPropsWithRef<typeof MultiCombobox>>) => (
    <IntlProvider locale="ja">
      <form>
        <FormControl label="コンボボックス">
          <MultiCombobox
            {...rest}
            name={name || 'default'}
            selectedItems={
              selectedItems !== undefined
                ? selectedItems
                : [{ label: 'option 1', value: 'value-1' }]
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

    // リストボックスからアイテムを2種続けて選択して、選択イベントの発火を確認
    await userEvent.click(screen.getByRole('option', { name: 'option 2' }))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })
    await userEvent.click(screen.getByRole('option', { name: 'option 4' }))
    expect(onSelect).toHaveBeenCalledWith({ label: 'option 4', value: 'value-4' })

    // リストボックスは開かれたままになっている
    expect(screen.queryByRole('listbox')).toBeInTheDocument()
    // 選択によってオプションボタンが再レンダリングされても、フォーカスがコンボボックスに残っていること
    expect(combobox()).toHaveFocus()
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
    await userEvent.click(deleteButtons()[0])
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 1', value: 'value-1' })
    await userEvent.click(deleteButtons()[1])
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 3', value: 'value-3' })
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

  it('リストボックスが展開されているときのESCキー入力はdocumentまで伝搬せず、閉じているときは伝搬すること', async () => {
    const handleDocumentKeyDown = vi.fn()
    document.addEventListener('keydown', handleDocumentKeyDown)

    try {
      render(template({}))

      await userEvent.click(combobox())
      expect(listbox()).toBeInTheDocument()

      // 1回目のESC: リストボックスを閉じるだけで、documentへは伝搬しない
      await userEvent.keyboard('{escape}')
      expect(listbox()).not.toBeInTheDocument()
      expect(handleDocumentKeyDown).not.toHaveBeenCalled()

      // 2回目のESC: リストボックスは既に閉じているため、documentまで伝搬する
      await userEvent.keyboard('{escape}')
      expect(handleDocumentKeyDown).toHaveBeenCalledTimes(1)
    } finally {
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  })

  it('コンボボックスがフォーカスされていないときに選択解除ボタンを押下してもリストボックスが表示されないこと', async () => {
    const onDelete = vi.fn()
    render(template({ onDelete }))

    // 選択解除ボタンをクリックしてもリストボックスが表示されないことを確認
    await userEvent.click(deleteButtons()[0])
    expect(listbox()).not.toBeInTheDocument()
  })

  it('新しいアイテムを追加できること', async () => {
    const onAdd = vi.fn()
    render(template({ onAdd, creatable: true, selectedItems: [] }))

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
    await userEvent.click(deleteButtons()[0])
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2', deletable: true })
  })

  it('disabled なコンボボックスではアイテムの選択・解除ができないこと', async () => {
    const onDelete = vi.fn()
    render(template({ onDelete, disabled: true }))

    // コンボボックスをクリックしてもリストボックスが表示されないことを確認
    await userEvent.click(combobox())
    expect(listbox()).not.toBeInTheDocument()

    // 選択解除ボタンをクリックしても onDelete が呼ばれないことを確認
    await userEvent.click(deleteButtons()[0])
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('キーボードでリストボックスからアイテムを追加できること', async () => {
    const onSelect = vi.fn()
    render(template({ onSelect, selectedItems: [] }))

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
    await userEvent.keyboard('{tab}')

    // 下矢印キーで選択中アイテムに移動し、Enter キーで削除できること
    await userEvent.keyboard('{arrowdown}')
    await userEvent.keyboard('{enter}')
    await userEvent.keyboard('{arrowdown}')
    await userEvent.keyboard('{enter}')
    await userEvent.keyboard('{arrowdown}')
    await userEvent.keyboard('{enter}')
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
    await userEvent.keyboard('{tab}')

    // 適当にキー入力
    await userEvent.keyboard('ops')

    // カーソルを左に移動をしても、キャレットがテキストの先頭にない間は削除ボタンにフォーカスが移動しないこと
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[2]).not.toHaveFocus()
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[2]).not.toHaveFocus()
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[2]).not.toHaveFocus()

    // キャレットが先頭にある状態でカーソルを左に移動すると、末尾の削除ボタンにフォーカスが移動すること
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[2]).toHaveFocus()

    // 削除ボタンにフォーカスがある状態でさらに手前の削除ボタンに移動できること
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[1]).toHaveFocus()
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[0]).toHaveFocus()

    // 一番手前の削除ボタンにフォーカスがある場合は、左矢印キーを押下してもこれ以上フォーカス移動できないこと
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[0]).toHaveFocus()

    // 末尾日の削除ボタンにフォーカスがある場合、右矢印キーを押下すると input いフォーカスが移動すること
    await userEvent.keyboard('{arrowright}')
    await userEvent.keyboard('{arrowright}')
    await userEvent.keyboard('{arrowright}')
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
    await userEvent.keyboard('{tab}')

    // 選択中のアイテムにフォーカスを移動
    await userEvent.keyboard('{arrowleft}')
    expect(deleteButtons()[1]).toHaveFocus()

    // Enter キーで削除
    await userEvent.keyboard('{enter}')
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
    await userEvent.keyboard('{tab}')

    // Backspace キーで末尾のアイテムが削除されること
    await userEvent.keyboard('{backspace}')
    expect(onDelete).toHaveBeenCalledWith({ label: 'option 2', value: 'value-2' })

    // Backspace によって削除した末尾アイテムはテキスト化されること
    expect(combobox()).toHaveValue('option 2')
  })

  it('BackspaceキーでReactNodeアイテムを削除すると、入力値にlabelTextが復元されること', async () => {
    const onDelete = vi.fn()
    const element = <span>アイコン付きラベル</span>
    render(
      template({
        selectedItems: [
          { label: 'option 1', value: 'value-1' },
          { label: element, value: 'value-2', labelText: 'ラベル2' },
        ],
        onDelete,
      }),
    )

    // リストボックスを開く
    await userEvent.keyboard('{tab}')

    // Backspace キーで末尾のアイテム(ReactNodeラベル)が削除されること
    await userEvent.keyboard('{backspace}')
    expect(onDelete).toHaveBeenCalledWith({
      label: element,
      value: 'value-2',
      labelText: 'ラベル2',
    })

    // Backspace によって削除した末尾アイテムはlabelTextとしてテキスト化されること
    expect(combobox()).toHaveValue('ラベル2')
  })

  it('制御時、selectedItems が外部から更新されると選択済みチップの表示が切り替わる', () => {
    const { rerender } = render(
      template({
        selectedItems: [{ label: 'option 1', value: 'value-1' }],
      }),
    )

    expect(screen.getByText('option 1')).toBeInTheDocument()
    expect(screen.queryByText('option 2')).not.toBeInTheDocument()

    rerender(
      template({
        selectedItems: [{ label: 'option 2', value: 'value-2' }],
      }),
    )

    expect(screen.queryByText('option 1')).not.toBeInTheDocument()
    expect(screen.getByText('option 2')).toBeInTheDocument()
  })

  it('制御時、selectedItems が空の場合のみ required 属性が付与される', () => {
    const { rerender } = render(
      template({
        selectedItems: [],
        required: true,
      }),
    )

    expect(combobox()).toBeRequired()

    rerender(
      template({
        selectedItems: [{ label: 'option 1', value: 'value-1' }],
        required: true,
      }),
    )

    expect(combobox()).not.toBeRequired()
  })

  it('制御時、selectedItems が空の場合のみ placeholder が表示される', () => {
    const { rerender } = render(
      template({
        selectedItems: [],
        placeholder: 'プレースホルダー',
      }),
    )

    expect(screen.getByText('プレースホルダー')).toBeInTheDocument()

    rerender(
      template({
        selectedItems: [{ label: 'option 1', value: 'value-1' }],
        placeholder: 'プレースホルダー',
      }),
    )

    expect(screen.queryByText('プレースホルダー')).not.toBeInTheDocument()
  })

  describe('非制御(uncontrolled)', () => {
    const items = [
      { label: 'option 1', value: 'value-1' },
      { label: 'option 2', value: 'value-2' },
    ]

    it('selectedItems を指定しない場合、アイテムを選択するとチップが追加される', async () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox name="default" items={items} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      await userEvent.click(combobox())
      await userEvent.click(screen.getByRole('option', { name: 'option 1' }))

      expect(within(screen.getByRole('listitem')).getByText('option 1')).toBeInTheDocument()
    })

    it('defaultSelectedItems を指定した場合、初期表示にチップが反映される', () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                items={items}
                defaultSelectedItems={[{ label: 'option 1', value: 'value-1' }]}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      expect(screen.getByText('option 1')).toBeInTheDocument()
    })

    it('非制御の場合、削除ボタンでチップが削除される', async () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                items={items}
                defaultSelectedItems={[{ label: 'option 1', value: 'value-1' }]}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      await userEvent.click(deleteButtons()[0])

      expect(screen.queryByText('option 1')).not.toBeInTheDocument()
    })

    it('selectedItems と onChangeSelected を指定した場合(制御)、操作だけでは表示が変わらない', async () => {
      const onChangeSelected = vi.fn()

      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                selectedItems={[]}
                onChangeSelected={onChangeSelected}
                items={items}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      await userEvent.click(combobox())
      await userEvent.click(screen.getByRole('option', { name: 'option 1' }))

      expect(onChangeSelected).toHaveBeenCalledWith([{ label: 'option 1', value: 'value-1' }])
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    })
  })

  describe('FormData', () => {
    const items = [
      { label: 'option 1', value: 'value-1' },
      { label: 'option 2', value: 'value-2' },
    ]

    it('selectedItems の値が name でFormDataから取得できること', () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                selectedItems={[
                  { label: 'option 1', value: 'value-1' },
                  { label: 'option 2', value: 'value-2' },
                ]}
                items={items}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const formData = new FormData(container.querySelector('form')!)

      expect(formData.getAll('default')).toEqual(['value-1', 'value-2'])
    })

    it('非制御(uncontrolled)で削除後、FormDataの値も追従すること', async () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                items={items}
                defaultSelectedItems={[{ label: 'option 1', value: 'value-1' }]}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      await userEvent.click(deleteButtons()[0])

      const formData = new FormData(container.querySelector('form')!)

      expect(formData.getAll('default')).toEqual([])
    })

    it('selectedItems が空のとき、FormDataに値が含まれないこと', () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox name="default" selectedItems={[]} items={items} />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const formData = new FormData(container.querySelector('form')!)

      expect(formData.getAll('default')).toEqual([])
    })

    it('name を指定しない場合、hidden inputがレンダリングされないこと', () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
              <MultiCombobox
                selectedItems={[{ label: 'option 1', value: 'value-1' }]}
                items={items}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      expect(container.querySelectorAll('input[type="hidden"]')).toHaveLength(0)
    })

    it('検索用テキストボックスの name には `${name}-query` が設定されること', () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox name="default" selectedItems={[]} items={items} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      expect(combobox()).toHaveAttribute('name', 'default-query')
    })

    it('disabledの場合、hidden inputも無効化されFormDataに値が含まれないこと', () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                disabled
                selectedItems={[{ label: 'option 1', value: 'value-1' }]}
                items={items}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )
      const formData = new FormData(container.querySelector('form')!)

      expect(formData.getAll('default')).toEqual([])
    })

    it('requiredかつ選択項目が無い場合、検索文字列を入力しただけではフォームの妥当性を満たさないこと', async () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox name="default" required selectedItems={[]} items={items} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      await userEvent.type(combobox(), 'option')

      expect(combobox()).toHaveProperty('validity.valid', false)
    })

    it('requiredでも選択項目があれば検索用テキストボックスの妥当性を満たすこと', () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="コンボボックス">
              <MultiCombobox
                name="default"
                required
                selectedItems={[{ label: 'option 1', value: 'value-1' }]}
                items={items}
              />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      expect(combobox()).toHaveProperty('validity.valid', true)
    })
  })
})
