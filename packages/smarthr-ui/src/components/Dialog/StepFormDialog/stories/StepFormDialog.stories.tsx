import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { Input } from '../../../Input'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { StepFormDialog } from '../StepFormDialog'
import { StepFormDialogItem } from '../StepFormDialogItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/StepFormDialog',
  component: StepFormDialog,
  subcomponents: { StepFormDialogItem },
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleSubmit: ComponentProps<typeof StepFormDialog>['onSubmit'] = (
      closeDialog,
      e,
      currentStep,
    ) => {
      if (onSubmit) {
        onSubmit(closeDialog, e, currentStep)
      } else {
        action('onSubmit')(e)
      }

      closeDialog()

      return currentStep
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <StepFormDialog {...rest} onClickClose={handleClose} onSubmit={handleSubmit} isOpen={open}>
          {children || 'ダイアログコンテンツ'}
        </StepFormDialog>
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
} as Meta<typeof StepFormDialog>

export const Playground: StoryObj<typeof StepFormDialog> = {}

export const Heading: StoryObj<typeof StepFormDialog> = {
  name: 'heading',
  args: {
    heading: 'フォームダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof StepFormDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログサブタイトル',
    },
  },
}

export const StepLength: StoryObj<typeof StepFormDialog> = {
  name: 'stepLength',
  args: {
    stepLength: 2,
  },
}

export const SubmitLabel: StoryObj<typeof StepFormDialog> = {
  name: 'submitLabel',
  args: {
    submitLabel: '取り込む',
  },
}

export const ContentBgColor: StoryObj<typeof StepFormDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof StepFormDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionTheme: StoryObj<typeof StepFormDialog> = {
  name: 'actionTheme',
  args: {
    actionTheme: 'danger',
  },
}

export const ActionDisabled: StoryObj<typeof StepFormDialog> = {
  name: 'actionDisabled',
  args: {
    actionDisabled: true,
  },
}

export const CloseDisabled: StoryObj<typeof StepFormDialog> = {
  name: 'closeDisabled',
  args: {
    closeDisabled: true,
  },
}

export const FirstStep: StoryObj<typeof StepFormDialog> = {
  name: 'firstStep',
  args: {
    firstStep: { id: 'a', stepNumber: 1 },
  },
}

export const OnSubmit: StoryObj<typeof StepFormDialog> = {
  name: 'onSubmit',
  args: {
    onSubmit: (closeDialog, e, currentStep) => {
      action('onSubmit')(e)
      closeDialog()
      return currentStep
    },
  },
}

export const OnClickClose: StoryObj<typeof StepFormDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnClickBack: StoryObj<typeof StepFormDialog> = {
  name: 'onClickBack',
  args: {
    stepLength: 2,
    firstStep: { id: 'a', stepNumber: 2 },
    onClickBack: action('onClickBack'),
  },
}

export const ResponseStatus: StoryObj<typeof StepFormDialog> = {
  name: 'responseStatus',
  render: ({ onSubmit, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof StepFormDialog>['responseStatus']>()
    const handleSubmit: ComponentProps<typeof StepFormDialog>['onSubmit'] = (
      closeDialog,
      e,
      currentStep,
    ) => {
      if (onSubmit) {
        onSubmit(closeDialog, e, currentStep)
      } else {
        action('onSubmit')(e)
      }

      closeDialog()

      return currentStep
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <StepFormDialog
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
        </StepFormDialog>
      </>
    )
  },
}

export const Width: StoryObj<typeof StepFormDialog> = {
  name: 'width',
  args: {
    width: _widthOptions.string,
  },
}

export const FirstFocusTarget: StoryObj<typeof StepFormDialog> = {
  name: 'firstFocusTarget',
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const handleSubmit: ComponentProps<typeof StepFormDialog>['onSubmit'] = (
      closeDialog,
      e,
      currentStep,
    ) => {
      if (onSubmit) {
        onSubmit(closeDialog, e, currentStep)
      } else {
        action('onSubmit')(e)
      }

      closeDialog()

      return currentStep
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <StepFormDialog
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
        </StepFormDialog>
      </>
    )
  },
}

export const OnPressEscape: StoryObj<typeof StepFormDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const OnClickOverlay: StoryObj<typeof StepFormDialog> = {
  name: 'onClickOverlay',
  args: {
    onClickOverlay: action('onClickOverlay'),
  },
}

export const PortalParent: StoryObj<typeof StepFormDialog> = {
  name: 'portalParent',
  render: ({ onSubmit, onClickClose, children, ...rest }) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const handleSubmit: ComponentProps<typeof StepFormDialog>['onSubmit'] = (
      closeDialog,
      e,
      currentStep,
    ) => {
      if (onSubmit) {
        onSubmit(closeDialog, e, currentStep)
      } else {
        action('onSubmit')(e)
      }

      closeDialog()

      return currentStep
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <StepFormDialog
          {...rest}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
          isOpen={open}
          portalParent={parentRef}
        >
          ダイアログコンテンツ
        </StepFormDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}
