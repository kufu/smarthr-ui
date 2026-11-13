import { type ComponentPropsWithRef, useActionState, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { FormControl } from '../../../FormGroup'
import { Input } from '../../../Input'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { ControlledFormDialog } from '../ControlledFormDialog'

import type { Meta, StoryObj } from '@storybook/react-vite'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/ControlledFormDialog',
  component: ControlledFormDialog,
  render: ({ onSubmit, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, helpers: { close: () => void }) => {
      if (onSubmit) {
        onSubmit(e, helpers)
      } else {
        action('onSubmit')(e)
      }
      // デフォルトのストーリーではフォーム送信後にダイアログを閉じる
      helpers.close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledFormDialog
          {...rest}
          isOpen={open}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
        >
          <FormControl label="名前">
            <Input name="name" />
          </FormControl>
        </ControlledFormDialog>
      </>
    )
  },
  args: {
    heading: 'フォームダイアログ（Controlled）',
    actionButton: '送信',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ControlledFormDialog>

export const Playground: StoryObj<typeof ControlledFormDialog> = {}

export const Heading: StoryObj<typeof ControlledFormDialog> = {
  name: 'heading',
  args: {
    heading: 'フォームダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof ControlledFormDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログサブタイトル',
    },
  },
}

export const ContentBgColor: StoryObj<typeof ControlledFormDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof ControlledFormDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionButton: StoryObj<typeof ControlledFormDialog> = {
  name: 'actionButton',
  args: {
    actionButton: '保存',
  },
}

export const ActionButtonTheme: StoryObj<typeof ControlledFormDialog> = {
  name: 'actionButton.theme',
  args: {
    actionButton: {
      text: '削除',
      theme: 'danger',
    },
  },
}

export const OnSubmit: StoryObj<typeof ControlledFormDialog> = {
  name: 'onSubmit',
  args: {
    onSubmit: (e, { close }) => {
      e.preventDefault()
      action('onSubmit')(e)
      close()
    },
  },
}

export const OnClickClose: StoryObj<typeof ControlledFormDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof ControlledFormDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const ResponseStatus: StoryObj<typeof ControlledFormDialog> = {
  name: 'responseStatus',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentPropsWithRef<typeof ControlledFormDialog>['responseStatus']>()

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledFormDialog
          {...args}
          responseStatus={responseStatus}
          isOpen={open}
          onClickClose={() => setOpen(false)}
          onSubmit={(e, { close }) => {
            e.preventDefault()
            action('onSubmit')(e)
            close()
          }}
        >
          <FormControl label="名前">
            <Input name="name" />
          </FormControl>
          <Cluster gap={1.25} className="shr-mt-2">
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
        </ControlledFormDialog>
      </>
    )
  },
}

type FormActionState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  name: string
}

export const FormAction: StoryObj<typeof ControlledFormDialog> = {
  name: 'action',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [validationError, setValidationError] = useState<string>()
    const [state, formAction, pending] = useActionState(
      async (_prev: FormActionState, formData: FormData): Promise<FormActionState> => {
        const name = String(formData.get('name'))

        // server action を模して、1秒後に結果を返す
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (name === 'エラー') {
          return { status: 'error', message: 'サーバーでエラーが発生しました', name }
        }

        action('action')(name)
        setOpen(false)

        return { status: 'success', name: '' }
      },
      { status: 'idle', name: '' },
    )

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledFormDialog
          {...args}
          isOpen={open}
          action={formAction}
          formProps={{ noValidate: true }}
          responseStatus={
            pending
              ? { status: 'processing' }
              : state.status === 'error'
                ? { status: 'error', text: state.message }
                : undefined
          }
          onSubmit={(e) => {
            // クライアントでのバリデーションに失敗した場合は preventDefault して action を実行させない
            if (!new FormData(e.currentTarget).get('name')) {
              e.preventDefault()
              setValidationError('名前を入力してください')

              return
            }

            setValidationError(undefined)
          }}
          onClickClose={() => setOpen(false)}
        >
          <FormControl
            errorMessages={validationError}
            label="名前"
            helpMessage="「エラー」と入力するとサーバーエラーになります"
          >
            {/* action 完了後に React がフォームをリセットするため、エラー時は送信した値を defaultValue で復元する */}
            <Input name="name" defaultValue={state.name} />
          </FormControl>
        </ControlledFormDialog>
      </>
    )
  },
}

export const ActionButtonDisabled: StoryObj<typeof ControlledFormDialog> = {
  name: 'actionButton.disabled',
  args: {
    actionButton: {
      text: '送信',
      disabled: true,
    },
  },
}

export const CloseButton: StoryObj<typeof ControlledFormDialog> = {
  name: 'closeButton',
  args: {
    closeButton: '閉じる',
  },
}

export const CloseButtonDisabled: StoryObj<typeof ControlledFormDialog> = {
  name: 'closeButton.disabled',
  args: {
    closeButton: {
      text: '閉じる',
      disabled: true,
    },
  },
}

export const SubActionArea: StoryObj<typeof ControlledFormDialog> = {
  name: 'subActionArea',
  args: {
    subActionArea: <Button onClick={action('subActionArea')}>サブアクション</Button>,
    width: '40em',
  },
}

export const PortalParent: StoryObj<typeof ControlledFormDialog> = {
  name: 'portalParent',
  render: (args) => {
    const [parentEl, setParentEl] = useState<HTMLDivElement | null>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div ref={setParentEl} className="shr-px-1.5 shr-py-2">
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <ControlledFormDialog
          {...args}
          portalParent={parentEl ?? undefined}
          isOpen={open}
          onClickClose={() => setOpen(false)}
          onSubmit={(e, { close }) => {
            e.preventDefault()
            action('onSubmit')(e)
            close()
          }}
        >
          <FormControl label="名前">
            <Input name="name" />
          </FormControl>
        </ControlledFormDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof ControlledFormDialog> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.string,
  },
}

export const Size: StoryObj<typeof ControlledFormDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof ControlledFormDialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledFormDialog
          {...args}
          firstFocusTarget={inputRef}
          isOpen={open}
          onPressEscape={handleClose}
          onClickClose={handleClose}
          onSubmit={(e, { close }) => {
            e.preventDefault()
            action('onSubmit')(e)
            close()
          }}
        >
          <FormControl label="名前">
            <Input ref={inputRef} name="name" />
          </FormControl>
        </ControlledFormDialog>
      </>
    )
  },
}
