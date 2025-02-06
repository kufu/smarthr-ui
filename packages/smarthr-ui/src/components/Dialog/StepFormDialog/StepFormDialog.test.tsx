import { userEvent } from '@storybook/test'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React, { useState } from 'react'

import { Button } from '../../Button'
import { Text } from '../../Text'

import { StepFormDialog } from './StepFormDialog'
import { StepFormDialogItem } from './StepFormDialogItem'

describe('StepFormDialog', () => {
  const DialogTemplate: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const steps = [
      { id: 'a', stepNumber: 1 },
      { id: 'b', stepNumber: 2 },
    ]
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>StepFormDialog</Button>
        <StepFormDialog
          isOpen={isOpen}
          title="StepFormDialog"
          submitLabel="保存"
          stepLength={2}
          firstStep={steps[0]}
          onSubmit={(closeDialog, _, currentStep) => {
            closeDialog()
            const nextStep = steps.find((step) => step.stepNumber === currentStep.stepNumber + 1)
            return nextStep
          }}
          onClickClose={() => {
            setIsOpen(false)
          }}
        >
          <StepFormDialogItem {...steps[0]}>
            <Text>Step1</Text>
          </StepFormDialogItem>
          <StepFormDialogItem {...steps[1]}>
            <Text>Step2</Text>
          </StepFormDialogItem>
        </StepFormDialog>
      </>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'StepFormDialog 1/2' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'StepFormDialog 1/2' })).toBeVisible()

    await act(() => fireEvent.click(screen.getByRole('button', { name: 'キャンセル' })))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'StepFormDialog 1/2' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'StepFormDialog' })).toHaveFocus()
  })

  it('ダイアログのステップの移動ができること', async () => {
    render(<DialogTemplate />)

    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'StepFormDialog 1/2' })).toBeVisible()

    await act(() => fireEvent.click(screen.getByRole('button', { name: '次へ' })))
    expect(screen.getByRole('dialog', { name: 'StepFormDialog 2/2' })).toBeVisible()

    await act(() => fireEvent.click(screen.getByRole('button', { name: '戻る' })))
    expect(screen.getByRole('dialog', { name: 'StepFormDialog 1/2' })).toBeVisible()

    await act(() => fireEvent.click(screen.getByRole('button', { name: '次へ' })))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'StepFormDialog 2/2' })).toBeVisible()
      },
      { timeout: 1000 },
    )

    await act(() => fireEvent.click(screen.getByRole('button', { name: '保存' })))
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'StepFormDialog 2/2' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'StepFormDialog' })).toHaveFocus()
  })
})
