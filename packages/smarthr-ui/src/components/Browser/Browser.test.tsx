import { userEvent } from '@storybook/test'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { Browser } from './Browser'

describe('Browser', () => {
  test('アイテムが空のとき', () => {
    render(<Browser items={[]} />)
    expect(screen.getByText(/該当する項目がありません/)).toBeInTheDocument()
  })

  test('アイテムが存在するとき、最初の要素がタブストップになる', async () => {
    const onSelectItem = vi.fn()
    render(
      <>
        <Browser
          items={[
            { value: '1', label: 'アイテム1' },
            { value: '2', label: 'アイテム2' },
            { value: '3', label: 'アイテム3' },
          ]}
          onSelectItem={onSelectItem}
        />
        <a href="/">次の要素</a>
      </>,
    )
    await userEvent.keyboard('[Tab]')
    expect(screen.getByRole('radio', { name: 'アイテム1' })).toHaveFocus()
    await userEvent.keyboard('[Tab]')
    expect(screen.getByRole('link', { name: '次の要素' })).toHaveFocus()
  })

  test('値を指定すると、ラジオボタンがチェックされ、タブストップになる', async () => {
    render(
      <>
        <Browser
          items={[
            { value: '1', label: 'アイテム1' },
            { value: '2', label: 'アイテム2' },
            { value: '3', label: 'アイテム3' },
          ]}
          value="2"
        />
        <a href="/">次の要素</a>
      </>,
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
      <Browser
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
        value="2-2"
        onSelectItem={onSelectItem}
      />,
    )

    await userEvent.click(screen.getByRole('radio', { name: 'アイテム2-1' }))
    await userEvent.keyboard(`[${key}]`)
    expect(onSelectItem).toHaveBeenCalledWith(expected)
  })
})
