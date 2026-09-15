import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act, useState } from 'react'

import { Button } from '../Button'
import { Stack } from '../Layout'

import { DropdownContent } from './DropdownContent'
import { Dropdown, DropdownTrigger } from './client'

// DropdownContent は requestAnimationFrame 経由でフォーカスを当てる
const waitForAnimationFrame = () =>
  act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  })

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

    await userEvent.click(screen.getByRole('button', { name: 'Trigger' }))

    // requestAnimationFrameの前はTriggerにフォーカスが残ったままであること(早すぎるfocus実行を検知する)
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus()

    await waitForAnimationFrame()

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
    await waitForAnimationFrame()
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button1' })).toHaveFocus()

    await userEvent.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
  })

  it('ドロップダウン展開後に最後の要素からTabするとトリガーにフォーカスが戻りドロップダウンが閉じること', async () => {
    render(template)

    act(() => screen.getByRole('button', { name: 'Trigger', expanded: false }).click())
    await waitForAnimationFrame()
    expect(screen.getByRole('button', { name: 'Button1' })).toBeVisible()

    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button1' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button2' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Button3' })).toHaveFocus()
    await userEvent.tab()
    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus()
    expect(screen.queryByRole('button', { name: 'Button1' })).toBeNull()
  })

  it('trigger の aria-controls が指す id を持つ要素が DOM 上に存在すること', () => {
    render(template)

    const trigger = screen.getByRole('button', { name: 'Trigger' })
    expect(trigger).toHaveAttribute('aria-controls')

    const controlsId = trigger.getAttribute('aria-controls')!
    expect(document.getElementById(controlsId)).toBeInTheDocument()
  })

  it('トリガー要素自身にonClickが設定されている場合、ドロップダウンの開閉トグル処理がそれより先に実行されること', async () => {
    const callOrder: string[] = []

    render(
      <Dropdown>
        <DropdownTrigger>
          <Button onClick={() => callOrder.push('button onClick (bubble)')}>Trigger</Button>
        </DropdownTrigger>
        <DropdownContent controllable>
          <Button>Button1</Button>
        </DropdownContent>
      </Dropdown>,
    )

    const trigger = screen.getByRole('button', { name: 'Trigger', expanded: false })

    // ドロップダウンの開閉トグル処理(handleDelegateClickTrigger)はgetBoundingClientRectを呼ぶ。
    // 独立したcaptureリスナーを別途追加する方法だと、onClickCaptureをonClickに書き換える
    // 退行があってもネイティブのcaptureフェーズ自体は変わらず先に発火してしまいテストが検知できない。
    // 実際のハンドラーが呼ぶgetBoundingClientRectを記録することで実行順序を検証する
    const originalGetBoundingClientRect = trigger.getBoundingClientRect.bind(trigger)
    trigger.getBoundingClientRect = () => {
      callOrder.push('dropdown handler (capture)')
      return originalGetBoundingClientRect()
    }

    await userEvent.click(trigger)

    expect(callOrder).toEqual(['dropdown handler (capture)', 'button onClick (bubble)'])
    expect(screen.getByRole('button', { name: 'Trigger', expanded: true })).toBeVisible()
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

  describe('Dropdownがネストしている場合', () => {
    const NestedTemplate = (
      <Dropdown>
        <DropdownTrigger>
          <Button>OuterTrigger</Button>
        </DropdownTrigger>
        <DropdownContent controllable>
          <Dropdown>
            <DropdownTrigger>
              <Button>InnerTrigger</Button>
            </DropdownTrigger>
            <DropdownContent>
              <Button>InnerButton</Button>
            </DropdownContent>
          </Dropdown>
          <Button>AfterInnerDropdown</Button>
        </DropdownContent>
      </Dropdown>
    )

    it('内側のDropdownContent内(controllable未指定)のクリックで内側のみ閉じ、外側は開いたままであること', async () => {
      render(NestedTemplate)

      await userEvent.click(screen.getByRole('button', { name: 'OuterTrigger' }))
      await userEvent.click(screen.getByRole('button', { name: 'InnerTrigger' }))
      expect(screen.getByRole('button', { name: 'InnerTrigger' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )

      await userEvent.click(screen.getByRole('button', { name: 'InnerButton' }))

      expect(screen.getByRole('button', { name: 'InnerTrigger' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
      expect(screen.getByRole('button', { name: 'OuterTrigger' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })

    it('内側のDropdownContent内の最後の要素からTabすると内側のトリガーにフォーカスが戻り、外側は開いたままであること', async () => {
      render(NestedTemplate)

      await userEvent.click(screen.getByRole('button', { name: 'OuterTrigger' }))
      await waitForAnimationFrame()
      await userEvent.click(screen.getByRole('button', { name: 'InnerTrigger' }))
      await waitForAnimationFrame()

      screen.getByRole('button', { name: 'InnerButton' }).focus()
      await userEvent.tab()

      expect(screen.getByRole('button', { name: 'InnerTrigger' })).toHaveFocus()
      expect(screen.getByRole('button', { name: 'InnerTrigger' })).toHaveAttribute(
        'aria-expanded',
        'false',
      )
      expect(screen.getByRole('button', { name: 'OuterTrigger' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })

    it('内側のDropdownContent内のアイテムからTabで抜けた後、続けてTabすると内側のDropdownの直後の要素にフォーカスが移り、外側は開いたままであること', async () => {
      render(NestedTemplate)

      await userEvent.click(screen.getByRole('button', { name: 'OuterTrigger' }))
      await waitForAnimationFrame()
      await userEvent.click(screen.getByRole('button', { name: 'InnerTrigger' }))
      await waitForAnimationFrame()

      screen.getByRole('button', { name: 'InnerButton' }).focus()
      await userEvent.tab()
      expect(screen.getByRole('button', { name: 'InnerTrigger' })).toHaveFocus()

      await userEvent.tab()
      expect(screen.getByRole('button', { name: 'AfterInnerDropdown' })).toHaveFocus()
      expect(screen.getByRole('button', { name: 'OuterTrigger' })).toHaveAttribute(
        'aria-expanded',
        'true',
      )
    })
  })
})
