import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useRef, useState } from 'react'

import { Button } from '../Button'
import { DatePicker } from '../DatePicker'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Cluster } from '../Layout'
import { RadioButton } from '../RadioButton'

import { Dialog } from './Dialog'

describe('Dialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Dialog</Button>
        <Dialog isOpen={isOpen} ariaLabel="Dialog">
          <form>
            <Fieldset title="Dialog" titleType="sectionTitle">
              <p>
                The value of isOpen must be managed by you, but you can customize content freely.
              </p>
              <DatePicker
                name="dialog_datepicker"
                value={'2021-01-01'}
                formatDate={(_date) => (_date ? _date.toDateString() : '')}
                title="dialog_datepicker"
              />
              <Fieldset title="Fruits">
                <Cluster as="ul">
                  <li>
                    <RadioButton name="Apple" checked>
                      Apple
                    </RadioButton>
                  </li>
                  <li>
                    <RadioButton name="Orange">Orange</RadioButton>
                  </li>
                  <li>
                    <RadioButton name="Grape">Grape</RadioButton>
                  </li>
                </Cluster>
              </Fieldset>
            </Fieldset>
            <div>
              <Button onClick={() => setIsOpen(false)}>close</Button>
            </div>
          </form>
        </Dialog>
      </>
    )
  }

  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
      },
      { timeout: 1000 },
    )
    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'Dialog' })).toHaveFocus()
  })
  it('ダイアログの外側をクリックするとダイアログが閉じないこと', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
    act(() => {
      screen.getByRole('button', { name: 'Dialog' }).click()
    })
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeVisible()

    act(() => {
      screen
        .getAllByRole('presentation')
        .find((presentation) => presentation.classList.contains('smarthr-ui-Dialog-background'))
        ?.click()
    })
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'Dialog' })).not.toBeNull()
      },
      { timeout: 1000 },
    )
  })

  it('フォーカストラップが動作すること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    expect(screen.getByRole('button', { name: 'close' })).toHaveFocus()
    await act(() => userEvent.tab())
    expect(screen.getByRole('textbox', { name: 'dialog_datepicker' })).toHaveFocus()
  })

  const DialogTemplateWithFocusTrap: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>特定の要素をフォーカス</Button>
        <Dialog
          isOpen={isOpen}
          onPressEscape={() => setIsOpen(false)}
          firstFocusTarget={inputRef}
          ariaLabel="特定の要素をフォーカスするダイアログ"
        >
          <form>
            <FormControl title="特定の要素をフォーカスするダイアログのInput">
              <Input ref={inputRef} name="input_focus_target" />
            </FormControl>
            <div>
              <Button onClick={() => setIsOpen(false)}>close</Button>
            </div>
          </form>
        </Dialog>
      </>
    )
  }
  it('開いた時に特定の要素をフォーカスできること', async () => {
    render(<DialogTemplateWithFocusTrap />)

    expect(
      screen.queryByRole('dialog', { name: '特定の要素をフォーカスするダイアログ' }),
    ).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(
      screen.getByRole('dialog', { name: '特定の要素をフォーカスするダイアログ' }),
    ).toBeVisible()

    expect(
      screen.getByRole('textbox', { name: '特定の要素をフォーカスするダイアログのInput' }),
    ).toHaveFocus()
  })
})
