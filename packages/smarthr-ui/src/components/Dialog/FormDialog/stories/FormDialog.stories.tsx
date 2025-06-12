import { action } from 'storybook/actions'

import type { Meta, StoryObj } from '@storybook/react'
import { FormDialog } from '../FormDialog'
import { ComponentProps, useRef, useState } from 'react'
import { Button } from '../../../Button'
import { RadioButton } from '../../../RadioButton'
import { Cluster } from '../../../Layout'
import { Input } from '../../../Input'
import { FormControl } from '../../../FormControl'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/FormDialog',
  component: FormDialog,
  render: ({ onSubmit, onClickClose, ...args }) => {
    const [open, setOpen] = useState(false)
    const handleSubmit = (close: () => void, e: React.FormEvent<HTMLFormElement>) => {
      onSubmit ? onSubmit(close, e) : action('onSubmit')(e)
      // デフォルトのストーリーではフォーム送信後にダイアログを閉じる
      close()
    }
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <FormDialog {...args} onClickClose={handleClose} onSubmit={handleSubmit} isOpen={open}>
          <FormControl title="名前">
            <Input name="name" />
          </FormControl>
        </FormDialog>
      </>
    )
  },
  argTypes: {
    titleTag: {
      name: 'titleTag（非推奨）',
    },
  },
  args: {
    title: 'フォームダイアログ',
    actionText: '送信',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FormDialog>

export const Playground: StoryObj<typeof FormDialog> = {}

export const Title: StoryObj<typeof FormDialog> = {
  name: 'title',
  args: {
    title: 'フォームダイアログタイトル',
  },
}

export const Subtitle: StoryObj<typeof FormDialog> = {
  name: 'subtitle',
  args: {
    subtitle: 'フォームダイアログサブタイトル',
  },
}

export const TitleTag: StoryObj<typeof FormDialog> = {
  name: 'titleTag（非推奨）',
  args: {
    titleTag: 'h3',
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

export const onPressEscape: StoryObj<typeof FormDialog> = {
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
          <FormControl title="名前">
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
          <FormControl title="名前">
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
  name: 'width',
  args: {
    width: _widthOptions.string,
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
          <FormControl title="名前">
            <Input ref={inputRef} name="name" />
          </FormControl>
        </FormDialog>
      </>
    )
  },
}
