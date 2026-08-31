import { useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { ControlledStepFormDialog } from '../ControlledStepFormDialog'
import { StepFormDialogItem } from '../StepFormDialogItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledStepFormDialog/StepFormDialogItem',
  component: StepFormDialogItem,
  argTypes: {
    id: { control: false },
    stepNumber: { control: false },
  },
  render: (_) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledStepFormDialog
          stepLength={2}
          firstStep={{ id: 'step-1', stepNumber: 1 }}
          isOpen={open}
          onSubmit={(e, { goto, close, currentStep }) => {
            action('onSubmit')(e)
            if (currentStep.id === 'step-2') {
              close()
            } else {
              goto({ id: 'step-2', stepNumber: 2 })
            }
          }}
          onClickClose={handleClose}
          heading="ステップダイアログ"
          submitButton="保存"
        >
          <StepFormDialogItem id="step-1" stepNumber={1}>
            ダイアログコンテンツ1
          </StepFormDialogItem>
          <StepFormDialogItem id="step-2" stepNumber={2}>
            ダイアログコンテンツ2
          </StepFormDialogItem>
        </ControlledStepFormDialog>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof StepFormDialogItem>

export const Playground: StoryObj<typeof StepFormDialogItem> = {}
