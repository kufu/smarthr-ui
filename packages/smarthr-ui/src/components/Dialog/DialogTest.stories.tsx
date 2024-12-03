import { StoryFn } from '@storybook/react'
import React, { ReactNode } from 'react'

import { Button } from '../Button'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Stack } from '../Layout'

import { useDialogSteps } from './useDialogSteps'

import { ActionDialog } from '.'

export default {
  title: 'Dialog（ダイアログ）/Step Dialog',
  component: ActionDialog,
}

type DialogContents = {
  [key: number]: Omit<
    React.ComponentProps<typeof ActionDialog>,
    'title' | 'onClickClose' | 'isOpen'
  > & { children: ReactNode }
}

export const Default: StoryFn = () => {
  const [currentStep, { setStep, nextStep, prevStep }] = useDialogSteps()

  const dialogContents: DialogContents = {
    0: {
      actionText: '',
      onClickAction: nextStep,
      children: null,
    },
    1: {
      actionText: '次へ',
      onClickAction: nextStep,
      children: (
        <FormControl title="Label 1">
          <Input name="input" />
        </FormControl>
      ),
    },
    2: {
      actionText: '完了',
      onClickAction: () => setStep(0),
      children: (
        <FormControl title="Label 2">
          <Input name="input" />
        </FormControl>
      ),
    },
  }

  const dialogContent = dialogContents[currentStep]

  return (
    <>
      <Stack>
        <div>
          <Button onClick={nextStep} aria-haspopup="dialog">
            Dialog
          </Button>
        </div>
        <FormControl title="Dummy">
          <Input name="input" />
        </FormControl>
      </Stack>

      <ActionDialog
        {...dialogContent}
        title={`Stepper Dialog ${currentStep} / 2`}
        isOpen={currentStep > 0}
        onClickClose={currentStep === 2 ? () => setStep(0) : prevStep}
      >
        {dialogContent.children}
      </ActionDialog>
    </>
  )
}
