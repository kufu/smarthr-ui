import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act, useState } from 'react'

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

  describe('トリガーボタンの disabled が動的に切り替わる場合', () => {
    const ToggleTemplate = ({ initialDisabled }: { initialDisabled: boolean }) => {
      const [disabled, setDisabled] = useState(initialDisabled)

      return (
        <>
          <Button onClick={() => setDisabled((d) => !d)}>Toggle</Button>
          <Dropdown>
            <DropdownTrigger>
              <Button disabled={disabled}>Trigger</Button>
            </DropdownTrigger>
            <DropdownContent controllable>
              <Stack>
                <Button>Button1</Button>
                <Button>Button2</Button>
              </Stack>
            </DropdownContent>
          </Dropdown>
        </>
      )
    }

    it('disabled から enabled に変わった後、トリガーをクリックするとドロップダウンが開くこと', async () => {
      const user = userEvent.setup()
      render(<ToggleTemplate initialDisabled={true} />)

      await user.click(screen.getByRole('button', { name: 'Toggle' }))

      await user.click(screen.getByRole('button', { name: 'Trigger' }))
      expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()
    })

    it('enabled から disabled に変わった後、トリガーをクリックしてもドロップダウンが開かないこと', async () => {
      const user = userEvent.setup()
      render(<ToggleTemplate initialDisabled={false} />)

      await user.click(screen.getByRole('button', { name: 'Toggle' }))

      await user.click(screen.getByRole('button', { name: 'Trigger' }))
      expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
    })
  })
})
