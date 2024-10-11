import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { ComponentProps, useRef, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { CheckBox } from '../CheckBox'
import { Fieldset } from '../Fieldset'
import { FormControl } from '../FormControl'
import { Input } from '../Input'
import { Cluster, Stack } from '../Layout'
import { RadioButton } from '../RadioButton'

import { StepFormDialog } from './StepFormDialog'

import { ActionDialog, ActionDialogContent, DialogTrigger, FormDialog } from '.'

export default {
  title: 'Dialog（ダイアログ）/FormDialog',
  component: FormDialog,
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
  const openedFocusRef = useRef<HTMLInputElement>(null)
  const onClickClose = () => {
    setOpenedDialog(null)
    setResponseMessage(undefined)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)

  return (
    <Cluster>
      <Button
        onClick={() => setOpenedDialog('normal')}
        aria-haspopup="dialog"
        aria-controls="dialog-form"
        data-test="dialog-trigger"
        // 別のスタッキングコンテキストがダイアログ背景よりも上に来ないことを確認するための記述
        style={{ position: 'relative', zIndex: 21 }}
      >
        FormDialog
      </Button>
      <FormDialog
        isOpen={openedDialog === 'normal'}
        title="FormDialog"
        subtitle="副題"
        actionText="保存"
        decorators={{ closeButtonLabel: (txt) => `cancel.(${txt})` }}
        onSubmit={(closeDialog, e) => {
          action('executed')()
          console.log('event', e)
          setResponseMessage(undefined)
          closeDialog()
        }}
        onClickClose={onClickClose}
        responseMessage={responseMessage}
        id="dialog-form"
        data-test="form-dialog-content"
        width="40em"
        subActionArea={<Button>サブアクション</Button>}
      >
        <Stack>
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
          <Cluster align="center">
            <p>切り替えボタン：</p>
            <Button
              onClick={() =>
                setResponseMessage({
                  status: 'success',
                  text: '保存しました。',
                })
              }
            >
              保存
            </Button>
            <Button
              onClick={() =>
                setResponseMessage({
                  status: 'error',
                  text: '何らかのエラーが発生しました。',
                })
              }
            >
              エラー
            </Button>
            <Button
              onClick={() =>
                setResponseMessage({
                  status: 'processing',
                })
              }
            >
              保存中
            </Button>
          </Cluster>
        </Stack>
      </FormDialog>
      <Button onClick={() => setOpenedDialog('opened')} data-test="opened-form-dialog-trigger">
        開いた状態で DOM に投入
      </Button>
      {openedDialog === 'opened' && (
        <FormDialog
          isOpen
          title="開いた状態で投入されたダイアログ"
          actionText="実行"
          onSubmit={(closeDialog) => {
            action('execute')()
            closeDialog()
          }}
          onClickClose={onClickClose}
          decorators={{ closeButtonLabel: (txt) => `close.(${txt})` }}
          firstFocusTarget={openedFocusRef}
          data-test="opened-form-dialog"
        >
          <FormControl
            title={
              <>
                <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
              </>
            }
          >
            <Input
              ref={openedFocusRef}
              name="opened_dialog_focus_target"
              data-test="opened-form-dialog-focus-target"
            />
          </FormControl>
        </FormDialog>
      )}
    </Cluster>
  )
}

Default.parameters = {
  docs: {
    description: {
      story: '`ActionDialog` includes an action button that used for submitting, etc.',
    },
  },
}

const RadioListCluster = styled(Cluster).attrs({ gap: 1.25 })`
  list-style: none;
`

export const Form_Dialog_With_Step: StoryFn = () => {
  const [openedDialog, setOpenedDialog] = useState<'normal' | 'opened' | null>(null)
  const [value, setValue] = React.useState('Apple')
  const [responseMessage, setResponseMessage] =
    useState<ComponentProps<typeof ActionDialog>['responseMessage']>()
  const onClickClose = () => {
    setOpenedDialog(null)
    setResponseMessage(undefined)
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)

  return (
    <Cluster>
      <Button
        onClick={() => setOpenedDialog('normal')}
        aria-haspopup="dialog"
        aria-controls="dialog-form"
        data-test="dialog-trigger"
      >
        FormDialog with Step
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
        onClickClose={onClickClose}
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

Form_Dialog_With_Step.parameters = {
  docs: {
    description: {
      story: '`FormDialog with step` is a form dialog that can be divided into multiple steps.',
    },
  },
}
