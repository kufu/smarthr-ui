import { userEvent } from '@storybook/test'
import { render, screen } from '@testing-library/react'
import React, { act } from 'react'

import { Button } from '../Button'
import { Stack } from '../Layout'

import { Dropdown } from './Dropdown'
import { DropdownContent } from './DropdownContent'
import { DropdownTrigger } from './DropdownTrigger'

describe('Dropdown', () => {
  const template = (
    <Dropdown>
      <DropdownTrigger>
        <Button>Trigger</Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <Stack>
          <Button>Button1</Button>
          <Button>Button2</Button>
          <Button>Button3</Button>
        </Stack>
      </DropdownContent>
    </Dropdown>
  )

  it('トリガーボタンがクリックされるとドロップダウンが開くこと', () => {
    render(template)

    act(() => screen.getByRole('button', { name: 'Trigger', expanded: false }).click())
    expect(screen.getByRole('button', { name: 'Trigger', expanded: true })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()
  })

  it('トリガーボタンとドロップダウンの間でフォーカスの行き来ができること', async () => {
    render(template)

    act(() => screen.getByRole('button', { name: 'Trigger' }).click())

    expect(screen.getByRole('button', { name: 'Button1' })).not.toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button1' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button2' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Button1' })).toHaveFocus()
    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus()
  })

  it('ドロップダウン展開後にドロップダウンの外側をクリックするとドロップダウンが閉じること', () => {
    render(template)

    act(() => screen.getByRole('button', { name: 'Trigger', expanded: false }).click())
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()

    act(() => document.body.click())
    expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
  })

  it('ドロップダウン展開後にShift+Tabでトリガーにフォーカスが戻るとドロップダウンが閉じること', async () => {
    render(template)
    act(() => screen.getByRole('button', { name: 'Trigger', expanded: false }).click())
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button1' })).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
  })

  it('ドロップダウンからフォーカスが外れるとドロップダウンが閉じること', async () => {
    render(template)

    act(() => screen.getByRole('button', { name: 'Trigger', expanded: false }).click())
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button1' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button2' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button3' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
  })
})
