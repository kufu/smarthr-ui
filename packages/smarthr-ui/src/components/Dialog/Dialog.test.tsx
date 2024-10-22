import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'

import { Button } from '../Button'
import { DatePicker } from '../DatePicker'
import { Fieldset } from '../Fieldset'
import { Heading } from '../Heading'
import { Cluster } from '../Layout'
import { RadioButton } from '../RadioButton'
import { Section } from '../SectioningContent'

import { Dialog } from './Dialog'

type Props = {
  closeWhenClickOverlay?: boolean
}

describe('Dialog', () => {
  const DialogTemplate: React.FC = (
    { closeWhenClickOverlay }: Props = { closeWhenClickOverlay: false },
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    console.log('isOpen', isOpen)
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
          onClickOverlay={closeWhenClickOverlay ? () => setIsOpen(false) : undefined}
        >
          <Section>
            <Heading>Dialog</Heading>
            <p>The value of isOpen must be managed by you, but you can customize content freely.</p>
            <DatePicker
              name="dialog_datepicker"
              value={'2021-01-01'}
              formatDate={(_date) => (_date ? _date.toDateString() : '')}
              title="test"
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
    await userEvent.tab()
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeVisible()

    await userEvent.tab({ shift: true })
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
})
