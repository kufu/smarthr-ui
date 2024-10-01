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

    act(() => screen.getByText('Trigger').click())
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()
  })

  it('トリガーボタンとドロップダウンの間でフォーカスの行き来ができること', async () => {
    render(template)

    act(() => screen.getByText('Trigger').click())

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

    act(() => screen.getByText('Trigger').click())
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()

    act(() => document.body.click())
    expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
  })

  it('ドロップダウンからダイアログを開いたときフォーカスが移動すること', async () => {
    render(
      <Dropdown>
        <DropdownTrigger>
          <Button>Trigger</Button>
        </DropdownTrigger>
        <DropdownContent controllable>
          <Button>Open Dialog</Button>
        </DropdownContent>
      </Dropdown>,
    )

    act(() => screen.getByText('Trigger').click())
    act(() => screen.getByRole('button', { name: 'Open Dialog' }).click())
  })
})