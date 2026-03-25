import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { Input } from '../../../Input'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { ControlledStepFormDialog } from '../ControlledStepFormDialog'
import { StepFormDialogItem } from '../StepFormDialogItem'

import type { Meta, StoryObj } from '@storybook/react-vite'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/ControlledStepFormDialog',
  component: ControlledStepFormDialog,
  subcomponents: { StepFormDialogItem },
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleSubmit: ComponentProps<typeof ControlledStepFormDialog>['onSubmit'] = (
      e,
      helpers,
    ) => {
      if (onSubmit) {
        onSubmit(e, helpers)
      } else {
        action('onSubmit')(e)
      }
      helpers.close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledStepFormDialog
          {...rest}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
          isOpen={open}
        >
          {children || 'ダイアログコンテンツ'}
        </ControlledStepFormDialog>
      </>
    )
  },
  args: {
    heading: 'フォームダイアログ',
    stepLength: 1,
    submitLabel: '保存',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof ControlledStepFormDialog>

export const Playground: StoryObj<typeof ControlledStepFormDialog> = {}

export const Heading: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'heading',
  args: {
    heading: 'フォームダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログサブタイトル',
    },
  },
}

export const StepLength: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'stepLength',
  args: {
    stepLength: 2,
  },
}

export const SubmitLabel: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'submitLabel',
  args: {
    submitLabel: '取り込む',
  },
}

export const ContentBgColor: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionTheme: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'actionTheme',
  args: {
    actionTheme: 'danger',
  },
}

export const ActionDisabled: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'actionDisabled',
  args: {
    actionDisabled: true,
  },
}

export const CloseDisabled: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'closeDisabled',
  args: {
    closeDisabled: true,
  },
}

export const FirstStep: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'firstStep',
  args: {
    firstStep: { id: 'a', stepNumber: 1 },
  },
}

export const OnSubmit: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'onSubmit',
  args: {
    onSubmit: (e, { close }) => {
      action('onSubmit')(e)
      close()
    },
  },
}

export const OnClickClose: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnClickBack: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'onClickBack',
  args: {
    stepLength: 2,
    firstStep: { id: 'a', stepNumber: 2 },
    onClickBack: action('onClickBack'),
  },
}

export const ResponseStatus: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'responseStatus',
  render: ({ onSubmit, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof ControlledStepFormDialog>['responseStatus']>()
    const handleSubmit: ComponentProps<typeof ControlledStepFormDialog>['onSubmit'] = (
      e,
      helpers,
    ) => {
      if (onSubmit) {
        onSubmit(e, helpers)
      } else {
        action('onSubmit')(e)
      }
      helpers.close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledStepFormDialog
          {...rest}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
          isOpen={open}
          responseStatus={responseStatus}
        >
          <Cluster gap={1.25}>
            <RadioButton
              name="responseStatus"
              checked={responseStatus?.status === 'success'}
              onChange={() => setResponseStatus({ status: 'success', text: '成功メッセージ' })}
            >
              success
            </RadioButton>
            <RadioButton
              name="responseStatus"
              checked={responseStatus?.status === 'error'}
              onChange={() => setResponseStatus({ status: 'error', text: 'エラーメッセージ' })}
            >
              error
            </RadioButton>
            <RadioButton
              name="responseStatus"
              checked={responseStatus?.status === 'processing'}
              onChange={() => setResponseStatus({ status: 'processing' })}
            >
              processing
            </RadioButton>
          </Cluster>
        </ControlledStepFormDialog>
      </>
    )
  },
}

export const Width: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'width',
  args: {
    width: _widthOptions.string,
  },
}

export const FirstFocusTarget: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'firstFocusTarget',
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const handleSubmit: ComponentProps<typeof ControlledStepFormDialog>['onSubmit'] = (
      e,
      helpers,
    ) => {
      if (onSubmit) {
        onSubmit(e, helpers)
      } else {
        action('onSubmit')(e)
      }
      helpers.close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledStepFormDialog
          {...rest}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
          isOpen={open}
          firstFocusTarget={inputRef}
        >
          <label>
            入力要素
            <Input name="stepformdialog_input" ref={inputRef} />
          </label>
        </ControlledStepFormDialog>
      </>
    )
  },
}

export const OnPressEscape: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const OnClickOverlay: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'onClickOverlay',
  args: {
    onClickOverlay: action('onClickOverlay'),
  },
}

export const PortalParent: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'portalParent',
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const handleSubmit: ComponentProps<typeof ControlledStepFormDialog>['onSubmit'] = (
      e,
      helpers,
    ) => {
      if (onSubmit) {
        onSubmit(e, helpers)
      } else {
        action('onSubmit')(e)
      }
      helpers.close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <ControlledStepFormDialog
          {...rest}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
          isOpen={open}
          portalParent={parentRef}
        >
          ダイアログコンテンツ
        </ControlledStepFormDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const AsyncSubmitSuccess: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'asyncSubmit（Promise対応・成功パターン）',
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof ControlledStepFormDialog>['responseStatus']>()

    const handleSubmit: ComponentProps<typeof ControlledStepFormDialog>['onSubmit'] = async (
      _e,
      { goto, close, currentStep },
    ) => {
      setResponseStatus({ status: 'processing' })
      // APIコールをシミュレート（成功パターン）
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setResponseStatus({ status: 'success', text: 'APIコールが成功しました' })

          // ステップに応じて遷移を制御
          if (currentStep.stepNumber === 1) {
            // ステップ1 → ステップ2へ遷移
            goto({ id: 'step-2', stepNumber: 2 })
          } else if (currentStep.stepNumber === 2) {
            // ステップ2 → ステップ3へ遷移
            goto({ id: 'step-3', stepNumber: 3 })
          } else {
            // 最終ステップ → ダイアログを閉じる
            close()
          }

          resolve()
        }, 500) // 0.5秒待機
      })
    }

    const handleClose =
      onClickClose ??
      (() => {
        setOpen(false)
        setResponseStatus(undefined)
      })

    const handleBack = () => {
      setResponseStatus(undefined)
    }

    return (
      <>
        <Button onClick={() => setOpen(true)}>非同期処理ダイアログを開く（成功）</Button>
        <ControlledStepFormDialog
          {...rest}
          stepLength={3}
          firstStep={{ id: 'step-1', stepNumber: 1 }}
          onClickClose={handleClose}
          onClickBack={handleBack}
          onSubmit={handleSubmit}
          isOpen={open}
          responseStatus={responseStatus}
        >
          <StepFormDialogItem id="step-1" stepNumber={1}>
            <p>「次へ」ボタンを押すと、0.5秒後にAPIコールが実行され、次のステップに進みます。</p>
          </StepFormDialogItem>

          <StepFormDialogItem id="step-2" stepNumber={2}>
            <p>引き続き「次へ」ボタンを押すと、さらに次のステップに進みます。</p>
          </StepFormDialogItem>

          <StepFormDialogItem id="step-3" stepNumber={3}>
            <p>「保存」ボタンを押すと、最終的な処理が実行されダイアログが閉じます。</p>
          </StepFormDialogItem>
        </ControlledStepFormDialog>
      </>
    )
  },
}

export const AsyncSubmitError: StoryObj<typeof ControlledStepFormDialog> = {
  name: 'asyncSubmit（Promise対応・エラーパターン）',
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof ControlledStepFormDialog>['responseStatus']>()

    const handleSubmit: ComponentProps<typeof ControlledStepFormDialog>['onSubmit'] = async (
      _e,
      _helpers,
    ) => {
      setResponseStatus({ status: 'processing' })
      // APIコールをシミュレート（エラーパターン）
      await new Promise<void>((_resolve, reject) => {
        setTimeout(() => {
          setResponseStatus({ status: 'error', text: 'バリデーションエラーが発生しました' })
          // エラー時は現在のステップを維持（エラーをスロー）
          reject(new Error('Validation error'))
        }, 500) // 0.5秒待機
      })
    }

    const handleClose =
      onClickClose ??
      (() => {
        setOpen(false)
        setResponseStatus(undefined)
      })

    const handleBack = () => {
      setResponseStatus(undefined)
    }

    return (
      <>
        <Button onClick={() => setOpen(true)}>非同期処理ダイアログを開く（エラー）</Button>
        <ControlledStepFormDialog
          {...rest}
          onClickClose={handleClose}
          onClickBack={handleBack}
          onSubmit={handleSubmit}
          isOpen={open}
          responseStatus={responseStatus}
        >
          <p>「次へ」ボタンを押すと、0.5秒後にエラーメッセージが表示されます。</p>
          <p>現在のページが維持されます。</p>
        </ControlledStepFormDialog>
      </>
    )
  },
}
