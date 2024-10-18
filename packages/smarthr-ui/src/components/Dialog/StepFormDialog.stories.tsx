import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { CheckBox } from '../CheckBox'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Cluster } from '../Layout'
import { RadioButton } from '../RadioButton'

import { StepFormDialog } from './StepFormDialog'

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

export const Default: StoryFn = () => {
  const [openedDialog, setOpenedDialog] = useState<'normal' | 'opened' | null>(null)
  const [value, setValue] = React.useState('Apple')
  const [responseMessage, setResponseMessage] =
    useState<ComponentProps<typeof ActionDialog>['responseMessage']>()
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)

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
        title="FormDialog"
        subtitle="副題"
        submitLabel="保存"
        decorators={{ closeButtonLabel: () => '閉じる', nextButtonLabel: () => 'Next' }}
        onSubmit={(closeDialog) => {
          action('executed')()
          setResponseMessage(undefined)
          closeDialog()
        }}
        onClickClose={() => {
          action('closed')()
          setOpenedDialog(null)
          setResponseMessage(undefined)
        }}
        onClickNext={() => {
          action('next')()
        }}
        onClickBack={() => {
          action('back')()
        }}
        responseMessage={responseMessage}
        id="dialog-form"
        data-test="form-dialog-content"
        width="40em"
      >
        <Fieldset title="fruits" innerMargin={0.5}>
          <RadioListCluster forwardedAs="ul">
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
              <RadioButton name="Grape" checked={value === 'Grape'} onChange={onChange}>
                Grape
              </RadioButton>
            </li>
          </RadioListCluster>
        </Fieldset>
        <FormControl title="Sample">
          <Input type="text" name="text" />
        </FormControl>
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
      </StepFormDialog>
    </Cluster>
  )
}

Default.parameters = {
  docs: {
    description: {
      story: '`FormDialog with step` is a form dialog that can be divided into multiple steps.',
    },
  },
}

const RadioListCluster = styled(Cluster).attrs({ gap: 1.25 })`
  list-style: none;
`
