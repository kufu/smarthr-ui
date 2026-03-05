import { useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { StepFormDialog } from '../StepFormDialog'
import { StepFormDialogItem } from '../StepFormDialogItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/StepFormDialog/StepFormDialogItem',
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
        <StepFormDialog
          heading="ステップダイアログ"
          stepLength={2}
          submitLabel="保存"
          firstStep={{ id: 'step-1', stepNumber: 1 }}
          onSubmit={(closeDialog, e, currentStep) => {
            action('onSubmit')(e)
            if (currentStep.id === 'step-2') {
              closeDialog()
            } else {
              return { id: 'step-2', stepNumber: 2 }
            }
          }}
          onClickClose={handleClose}
          isOpen={open}
        >
          <StepFormDialogItem id="step-1" stepNumber={1}>
            ダイアログコンテンツ1
          </StepFormDialogItem>
          <StepFormDialogItem id="step-2" stepNumber={2}>
            ダイアログコンテンツ2
          </StepFormDialogItem>
        </StepFormDialog>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof StepFormDialogItem>

export const Playground: StoryObj<typeof StepFormDialogItem> = {}
