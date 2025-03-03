import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'
import { CheckBox } from '../CheckBox'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Cluster } from '../Layout'
import { RadioButton } from '../RadioButton'

import { StepFormDialog, StepFormDialogItem } from './StepFormDialog'

import { ActionDialog, ActionDialogContent, DialogTrigger } from '.'

export default {
  title: 'Dialog（ダイアログ）/StepFormDialog',
  component: StepFormDialog,
  subcomponents: {
    DialogTrigger,
    ActionDialogContent,
  },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
    withTheming: true,
  },
}

const classNameGenerator = tv({
  base: 'shr-list-none',
})

export const Default: StoryFn = () => {
  const [openedDialog, setOpenedDialog] = useState<'normal' | 'opened' | null>(null)
  const [value, setValue] = React.useState('Apple')
  const [responseMessage, setResponseMessage] =
    useState<ComponentProps<typeof ActionDialog>['responseMessage']>()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const stepOrder = [
    { id: 'a', stepNumber: 1 },
    {
      id: 'b',
      stepNumber: 2,
    },
    { id: 'c', stepNumber: 3 },
  ]

  return (
    <Cluster>
      <Button
        onClick={() => setOpenedDialog('normal')}
        aria-haspopup="dialog"
        aria-controls="dialog-form"
        data-test="dialog-trigger"
      >
        StepFormDialog
      </Button>
      {/* // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <StepFormDialog
        isOpen={openedDialog === 'normal'}
        title="StepFormDialog"
        submitLabel="保存"
        firstStep={stepOrder[0]}
        onSubmit={(closeDialog, e, currentStep) => {
          action('onSubmit')()
          setResponseMessage(undefined)
          if (currentStep.id === stepOrder[2].id) {
            closeDialog()
          }
          if (currentStep.id === stepOrder[0].id) {
            const skip = e.currentTarget.elements.namedItem('skip') as HTMLInputElement
            if (skip.checked) {
              return stepOrder[2]
            }
          }
          const currentStepIndex = stepOrder.findIndex((step) => step.id === currentStep.id)
          return stepOrder.at(currentStepIndex + 1)
        }}
        onClickClose={() => {
          action('closed')()
          setOpenedDialog(null)
          setResponseMessage(undefined)
        }}
        onClickBack={() => {
          action('back')()
        }}
        stepLength={3}
        responseMessage={responseMessage}
        id="dialog-form"
        data-test="form-dialog-content"
        width="40em"
      >
        <StepFormDialogItem {...stepOrder[0]}>
          <Fieldset title="fruits" innerMargin={0.5}>
            <Cluster className={classNameGenerator()} as="ul">
              <li>
                <RadioButton name="Apple" checked={value === 'Apple'} onChange={onChange}>
                  Apple
                </RadioButton>
              </li>
              <li>
                <RadioButton name="Orange" checked={value === 'Orange'} onChange={onChange}>
                  Orange
                </RadioButton>
              </li>
              <li>
                <RadioButton name="skip" checked={value === 'skip'} onChange={onChange}>
                  これを選ぶとステップ2を飛ばして3に進みます
                </RadioButton>
              </li>
            </Cluster>
          </Fieldset>
        </StepFormDialogItem>
        <StepFormDialogItem {...stepOrder[1]}>
          <FormControl id="b" title="Sample">
            <Input type="text" name="text" />
          </FormControl>
        </StepFormDialogItem>
        <StepFormDialogItem {...stepOrder[2]}>
          <Fieldset title="fruits" innerMargin={0.5}>
            <ul>
              <li>
                <CheckBox name="1">CheckBox</CheckBox>
              </li>

              <li>
                <CheckBox name="error" error>
                  CheckBox / error
                </CheckBox>
              </li>

              <li>
                <CheckBox name="disabled" disabled>
                  CheckBox / disabled
                </CheckBox>
              </li>
            </ul>
          </Fieldset>
        </StepFormDialogItem>
      </StepFormDialog>
    </Cluster>
  )
}

Default.parameters = {
  docs: {
    description: {
      story: '`StepFormDialog` is a form dialog that can be divided into multiple steps.',
    },
  },
}
