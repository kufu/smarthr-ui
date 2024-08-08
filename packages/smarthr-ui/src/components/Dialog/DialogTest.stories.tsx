import { StoryFn } from '@storybook/react'
import React, { useState } from 'react'

import { Button } from '../Button'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Stack } from '../Layout'

import { ActionDialog } from '.'

export default {
  title: 'Dialog（ダイアログ）/Step Dialog',
  component: ActionDialog,
}

export const Default: StoryFn = () => {
  const [step, setStep] = useState<number>(0)
  const onClickClose = () => setStep(0)

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
        title="Stepper Dialog 1 / 2"
        isOpen={step === 1}
        actionText="次へ"
        hasNextStep={true}
        onClickClose={onClickClose}
        onClickAction={() => {
          setStep(step + 1)
        }}
      >
        <FormControl title="Label">
          <Input name="input" />
        </FormControl>
      </ActionDialog>
      <ActionDialog
        title="Stepper Dialog 2 / 2"
        isOpen={step === 2}
        actionText="完了"
        onClickClose={onClickClose}
        onClickAction={() => {
          setStep(0)
        }}
      >
        <FormControl title="Label">
          <Input name="input" />
        </FormControl>
      </ActionDialog>
    </>
  )
}
