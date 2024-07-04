import { StoryFn } from '@storybook/react'
import React, { ReactNode, useState } from 'react'

import { Button } from '../Button'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Stack } from '../Layout'

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
  const [step, setStep] = useState<number>(0)
  const [prevStep, setPrevStep] = useState<number>(step)

  if (step !== prevStep && step > 0) {
    setPrevStep(step)
  }

  const onClickClose = () => setStep((prev) => prev - 1)

  const dialogContents: DialogContents = {
    1: {
      actionText: '次へ',
      onClickAction: () => setStep((prev) => prev + 1),
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

  const dialogContent = dialogContents[step]

  return (
    <>
      <Stack>
        <div>
          <Button onClick={() => setStep(1)} aria-haspopup="dialog">
            Dialog
          </Button>
        </div>
        <FormControl title="Dummy">
          <Input name="input" />
        </FormControl>
      </Stack>

      <ActionDialog
        {...dialogContent}
        title={`Stepper Dialog ${step} / 2`}
        isOpen={step > 0}
        actionDisabled={step === 2}
        onClickClose={onClickClose}
      />
    </>
  )
}
