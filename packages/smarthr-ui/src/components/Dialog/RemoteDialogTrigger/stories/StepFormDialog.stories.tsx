import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { StepFormDialogItem } from '../../ControlledStepFormDialog'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'
import { StepFormDialog } from '../StepFormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

/** props は [StepFormDialog](./?path=/docs/dialog（ダイアログ）-dialog-stepformdialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/StepFormDialog',
  component: StepFormDialog,
  render: (args) => (
    <>
      <RemoteDialogTrigger targetId="remote-dialog">
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <StepFormDialog
        {...args}
        id="remote-dialog"
        stepLength={2}
        firstStep={{ id: 'step-1', stepNumber: 1 }}
        onSubmit={(e, { currentStep, goto, close }) => {
          action('onSubmit')(e, currentStep)

          if (currentStep.id === 'step-2') {
            close()
          } else {
            goto({ id: 'step-2', stepNumber: 2 })
          }
        }}
        heading="ステップフォームダイアログ"
        submitButton="保存"
      >
        <StepFormDialogItem id="step-1" stepNumber={1}>
          <p>ステップ1のコンテンツです。</p>
        </StepFormDialogItem>
        <StepFormDialogItem id="step-2" stepNumber={2}>
          <p>ステップ2のコンテンツです。</p>
        </StepFormDialogItem>
      </StepFormDialog>
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof StepFormDialog>

export const Playground: StoryObj<typeof StepFormDialog> = {}
