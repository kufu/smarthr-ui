import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProvider } from '../../intl'

import { Browser } from './Browser'

describe('Browser', () => {
  test('アイテムが存在するとき、最初の要素がタブストップになる', async () => {
    const onSelectItem = vi.fn()
    render(
      <IntlProvider locale="ja">
        <Browser
          onSelectItem={onSelectItem}
          items={[
            { value: '1', label: 'アイテム1' },
            { value: '2', label: 'アイテム2' },
            { value: '3', label: 'アイテム3' },
          ]}
        />
        <a href="/">次の要素</a>
      </IntlProvider>,
    )
    await userEvent.keyboard('[Tab]')
    expect(screen.getByRole('radio', { name: 'アイテム1' })).toHaveFocus()
    await userEvent.keyboard('[Tab]')
    expect(screen.getByRole('link', { name: '次の要素' })).toHaveFocus()
  })

  test.each([
    ['Enter', '1', 'アイテム1'],
    ['Space', '1', 'アイテム1'],
    ['ArrowRight', '1', 'アイテム1'],
    ['ArrowUp', '3', 'アイテム3'],
    ['ArrowDown', '2', 'アイテム2'],
  ])('未選択の状態で%sを押すと、%sが選択される', async (key, value, label) => {
    const onSelectItem = vi.fn()
    const user = userEvent.setup()
    render(
      <IntlProvider locale="ja">
        <Browser
          onSelectItem={onSelectItem}
          items={[
            { value: '1', label: 'アイテム1' },
            { value: '2', label: 'アイテム2' },
            { value: '3', label: 'アイテム3' },
          ]}
        />
      </IntlProvider>,
    )

    await user.tab()
    expect(screen.getByRole('radio', { name: 'アイテム1' })).toHaveFocus()
    expect(onSelectItem).not.toHaveBeenCalled()

    await user.keyboard(`[${key}]`)
    expect(onSelectItem).toHaveBeenCalledExactlyOnceWith(value)
    expect(screen.getByRole('radio', { name: label })).toHaveFocus()
  })

  test('同じ値の別の Browser があっても、操作中の Browser にフォーカスを維持する', async () => {
    const onSelectItem = vi.fn()
    const onSelectOther = vi.fn()
    const user = userEvent.setup()
    const items = [
      { value: 'folder:1', label: 'フォルダー1' },
      { value: 'folder:2', label: 'フォルダー2' },
    ]
    render(
      <IntlProvider locale="ja">
        <form>
          <Browser onSelectItem={onSelectOther} items={items} />
        </form>
        <form>
          <Browser onSelectItem={onSelectItem} items={items} />
        </form>
      </IntlProvider>,
    )
    const [, secondBrowser] = screen.getAllByRole('application')
    const [firstItem, secondItem] = within(secondBrowser).getAllByRole('radio')

    act(() => firstItem.focus())

    await user.keyboard('[ArrowDown]')

    expect(onSelectItem).toHaveBeenCalledExactlyOnceWith('folder:2')
    expect(onSelectOther).not.toHaveBeenCalled()
    expect(secondItem).toHaveFocus()
  })

  test('値を指定すると、ラジオボタンがチェックされ、タブストップになる', async () => {
    render(
      <IntlProvider locale="ja">
        <Browser
          value="2"
          items={[
            { value: '1', label: 'アイテム1' },
            { value: '2', label: 'アイテム2' },
            { value: '3', label: 'アイテム3' },
          ]}
        />
        <a href="/">次の要素</a>
      </IntlProvider>,
    )
    expect(screen.getByRole('radio', { name: 'アイテム2' })).toBeChecked()
    await userEvent.keyboard('[Tab]')
    expect(screen.getByRole('radio', { name: 'アイテム2' })).toHaveFocus()
    await userEvent.keyboard('[Tab]')
    expect(screen.getByRole('link', { name: '次の要素' })).toHaveFocus()
  })

  test.each([
    ['ArrowUp', '2-1'],
    ['ArrowDown', '2-3'],
    ['ArrowRight', '3-1'],
    ['ArrowLeft', '1-1'],
  ])('%sを押すと、%sが選択される', async (key, expected) => {
    const onSelectItem = vi.fn()
    render(
      <IntlProvider locale="ja">
        <Browser
          value="2-2"
          onSelectItem={onSelectItem}
          items={[
            {
              value: '1-1',
              label: 'アイテム1-1',
              children: [
                {
                  value: '2-1',
                  label: 'アイテム2-1',
                },
                {
                  value: '2-2',
                  label: 'アイテム2-2',
                  children: [{ value: '3-1', label: 'アイテム3-1' }],
                },
                {
                  value: '2-3',
                  label: 'アイテム2-3',
                },
              ],
            },
            {
              value: '1-2',
              label: 'アイテム1-2',
            },
            { value: '1-3', label: 'アイテム1-3' },
          ]}
        />
        ,
      </IntlProvider>,
    )

    await userEvent.click(screen.getByRole('radio', { name: 'アイテム2-1' }))
    await userEvent.keyboard(`[${key}]`)
    expect(onSelectItem).toHaveBeenCalledWith(expected)
  })
})
