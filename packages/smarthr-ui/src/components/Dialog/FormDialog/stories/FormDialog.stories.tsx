import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { FormControl } from '../../../FormControl'
import { Input } from '../../../Input'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { FormDialog } from '../FormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/FormDialog',
  component: FormDialog,
  render: ({ onSubmit, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleSubmit = (close: () => void, e: React.FormEvent<HTMLFormElement>) => {
      if (onSubmit) {
        onSubmit(close, e)
      } else {
        action('onSubmit')(e)
      }

      // デフォルトのストーリーではフォーム送信後にダイアログを閉じる
      close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <FormDialog {...rest} onClickClose={handleClose} onSubmit={handleSubmit} isOpen={open}>
          <FormControl label="名前">
            <Input name="name" />
          </FormControl>
        </FormDialog>
      </>
    )
  },
  args: {
    heading: 'フォームダイアログ',
    actionText: '送信',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FormDialog>

export const Playground: StoryObj<typeof FormDialog> = {}

export const Heading: StoryObj<typeof FormDialog> = {
  name: 'heading',
  args: {
    heading: 'フォームダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof FormDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログサブタイトル',
    },
  },
}

export const ContentBgColor: StoryObj<typeof FormDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof FormDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionText: StoryObj<typeof FormDialog> = {
  name: 'actionText',
  args: {
    actionText: '保存',
  },
}

export const ActionTheme: StoryObj<typeof FormDialog> = {
  name: 'actionTheme',
  args: {
    actionTheme: 'danger',
  },
}

export const OnSubmit: StoryObj<typeof FormDialog> = {
  name: 'onSubmit',
  args: {
    onSubmit: (closeDialog, e) => {
      e.preventDefault()
      action('onSubmit')(e)
      closeDialog()
    },
  },
}

export const OnClickClose: StoryObj<typeof FormDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof FormDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const ResponseStatus: StoryObj<typeof FormDialog> = {
  name: 'responseStatus',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof FormDialog>['responseStatus']>()

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <FormDialog
          {...args}
          responseStatus={responseStatus}
          isOpen={open}
          onClickClose={() => setOpen(false)}
          onSubmit={(close, e) => {
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
        </FormDialog>
      </>
    )
  },
}

export const ActionDisabled: StoryObj<typeof FormDialog> = {
  name: 'actionDisabled',
  args: {
    actionDisabled: true,
  },
}

export const CloseDisabled: StoryObj<typeof FormDialog> = {
  name: 'closeDisabled',
  args: {
    closeDisabled: true,
  },
}

export const SubActionArea: StoryObj<typeof FormDialog> = {
  name: 'subActionArea',
  args: {
    subActionArea: <Button onClick={action('subActionArea')}>サブアクション</Button>,
    width: '40em',
  },
}

export const PortalParent: StoryObj<typeof FormDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <FormDialog
          {...args}
          portalParent={parentRef}
          isOpen={open}
          onClickClose={() => setOpen(false)}
          onSubmit={(close, e) => {
            e.preventDefault()
            action('onSubmit')(e)
            close()
          }}
        >
          <FormControl label="名前">
            <Input name="name" />
          </FormControl>
        </FormDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof FormDialog> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.string,
  },
}

export const Size: StoryObj<typeof FormDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof FormDialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <FormDialog
          {...args}
          firstFocusTarget={inputRef}
          isOpen={open}
          onPressEscape={handleClose}
          onClickClose={handleClose}
          onSubmit={(close, e) => {
            e.preventDefault()
            action('onSubmit')(e)
            close()
          }}
        >
          <FormControl label="名前">
            <Input ref={inputRef} name="name" />
          </FormControl>
        </FormDialog>
      </>
    )
  },
}
