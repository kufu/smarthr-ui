import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useRef, useState } from 'react'

import { Button } from '../Button'
import { DatePicker } from '../DatePicker'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Heading } from '../Heading'
import { Input } from '../Input'
import { Cluster } from '../Layout'
import { RadioButton } from '../RadioButton'
import { Section } from '../SectioningContent'

import { Dialog } from './Dialog'

describe('Dialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-controls="dialog-default"
          // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
          style={{ zIndex: 21, position: 'relative' }}
        >
          Dialog
        </Button>
        <Dialog
          isOpen={isOpen}
          onPressEscape={() => setIsOpen(false)}
          id="dialog-default"
          ariaLabel="Dialog"
        >
          <Section>
            <Heading>Dialog</Heading>
            <p>The value of isOpen must be managed by you, but you can customize content freely.</p>
            <DatePicker
              name="dialog_datepicker"
              value={'2021-01-01'}
              formatDate={(_date) => (_date ? _date.toDateString() : '')}
              title="dialog_datepicker"
              data-test="dialog-datepicker"
            />
            <Fieldset title="Fruits" innerMargin={0.5}>
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
          </Section>
          <div className="shr-flex shr-justify-end">
            <Button onClick={() => setIsOpen(false)}>close</Button>
          </div>
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
        <Button onClick={() => setIsOpen(true)} aria-haspopup="dialog" aria-controls="dialog-focus">
          特定の要素をフォーカス
        </Button>
        <Dialog
          isOpen={isOpen}
          onPressEscape={() => setIsOpen(false)}
          id="dialog-focus"
          firstFocusTarget={inputRef}
          ariaLabel="特定の要素をフォーカスするダイアログ"
        >
          <FormControl title="特定の要素をフォーカスするダイアログのInput">
            <Input ref={inputRef} name="input_focus_target" data-test="input-focus-target" />
          </FormControl>
          <div className="shr-flex shr-justify-end">
            <Button onClick={() => setIsOpen(false)}>close</Button>
          </div>
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
