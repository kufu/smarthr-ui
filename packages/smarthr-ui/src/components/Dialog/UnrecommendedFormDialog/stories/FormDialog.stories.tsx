import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { FormControl } from '../../../FormControl'
import { Input } from '../../../Input'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { UnrecommendedFormDialog } from '../UnrecommendedFormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/UnrecommendedFormDialog',
  component: UnrecommendedFormDialog,
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
        <UnrecommendedFormDialog
          {...rest}
          onClickClose={handleClose}
          onSubmit={handleSubmit}
          isOpen={open}
        >
          <FormControl label="名前">
            <Input name="name" />
          </FormControl>
        </UnrecommendedFormDialog>
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
} satisfies Meta<typeof UnrecommendedFormDialog>

export const Playground: StoryObj<typeof UnrecommendedFormDialog> = {}

export const Heading: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'heading',
  args: {
    heading: 'フォームダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'フォームダイアログタイトル',
      sub: 'フォームダイアログサブタイトル',
    },
  },
}

export const ContentBgColor: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionText: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'actionText',
  args: {
    actionText: '保存',
  },
}

export const ActionTheme: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'actionTheme',
  args: {
    actionTheme: 'danger',
  },
}

export const OnSubmit: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'onSubmit',
  args: {
    onSubmit: (e, { close }) => {
      e.preventDefault()
      action('onSubmit')(e)
      close()
    },
  },
}

export const OnClickClose: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const ResponseStatus: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'responseStatus',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof UnrecommendedFormDialog>['responseStatus']>()

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <UnrecommendedFormDialog
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
        </UnrecommendedFormDialog>
      </>
    )
  },
}

export const ActionDisabled: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'actionDisabled',
  args: {
    actionDisabled: true,
  },
}

export const CloseDisabled: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'closeDisabled',
  args: {
    closeDisabled: true,
  },
}

export const SubActionArea: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'subActionArea',
  args: {
    subActionArea: <Button onClick={action('subActionArea')}>サブアクション</Button>,
    width: '40em',
  },
}

export const PortalParent: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <UnrecommendedFormDialog
          {...args}
          portalParent={parentRef}
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
        </UnrecommendedFormDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.string,
  },
}

export const Size: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof UnrecommendedFormDialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <UnrecommendedFormDialog
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
        </UnrecommendedFormDialog>
      </>
    )
  },
}
