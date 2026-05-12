import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { ControlledActionDialog } from '../ControlledActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/ControlledActionDialog',
  component: ControlledActionDialog,
  render: ({ onClickAction, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleAction = onClickAction
      ? (e: React.MouseEvent, helpers: { close: () => void }) => onClickAction(e, helpers)
      : (_: React.MouseEvent, { close }: { close: () => void }) => close()
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledActionDialog
          {...rest}
          onClickClose={handleClose}
          onClickAction={handleAction}
          isOpen={open}
        >
          ダイアログコンテンツ
        </ControlledActionDialog>
      </>
    )
  },
  args: {
    heading: 'アクションダイアログ（Controlled）',
    actionButton: 'アクションボタンラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ControlledActionDialog>

export const Playground: StoryObj<typeof ControlledActionDialog> = {}

export const Heading: StoryObj<typeof ControlledActionDialog> = {
  name: 'heading',
  args: {
    heading: 'ダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof ControlledActionDialog> = {
  name: 'Heading.sub',
  args: {
    heading: {
      text: 'ダイアログタイトル',
      sub: 'ダイアログサブタイトル',
    },
  },
}

export const ContentBgColor: StoryObj<typeof ControlledActionDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof ControlledActionDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionButton: StoryObj<typeof ControlledActionDialog> = {
  name: 'actionButton',
  args: {
    actionButton: '保存',
  },
}

export const ActionButtonTheme: StoryObj<typeof ControlledActionDialog> = {
  name: 'actionButton.theme',
  args: {
    actionButton: {
      text: '削除',
      theme: 'danger',
    },
  },
}

export const OnClickAction: StoryObj<typeof ControlledActionDialog> = {
  name: 'onClickAction',
  args: {
    onClickAction: (e, { close }) => {
      action('onClickAction')(e)
      close()
    },
  },
}

export const OnClickClose: StoryObj<typeof ControlledActionDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof ControlledActionDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const ResponseStatus: StoryObj<typeof ControlledActionDialog> = {
  name: 'responseStatus',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof ControlledActionDialog>['responseStatus']>()

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledActionDialog
          {...args}
          responseStatus={responseStatus}
          isOpen={open}
          onClickClose={() => setOpen(false)}
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
        </ControlledActionDialog>
      </>
    )
  },
}

export const ActionButtonDisabled: StoryObj<typeof ControlledActionDialog> = {
  name: 'actionButton.disabled',
  args: {
    actionButton: {
      text: 'アクションボタンラベル',
      disabled: true,
    },
  },
}

export const CloseButton: StoryObj<typeof ControlledActionDialog> = {
  name: 'closeButton',
  args: {
    closeButton: '閉じる',
  },
}

export const CloseButtonDisabled: StoryObj<typeof ControlledActionDialog> = {
  name: 'closeButton.disabled',
  args: {
    closeButton: {
      text: '閉じる',
      disabled: true,
    },
  },
}

export const SubActionArea: StoryObj<typeof ControlledActionDialog> = {
  name: 'subActionArea',
  args: {
    subActionArea: <Button onClick={action('subActionArea')}>サブアクション</Button>,
    width: '40em',
  },
}

export const PortalParent: StoryObj<typeof ControlledActionDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <ControlledActionDialog
          {...args}
          portalParent={parentRef}
          isOpen={open}
          onClickClose={() => setOpen(false)}
        >
          ダイアログコンテンツ
        </ControlledActionDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof ControlledActionDialog> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.string,
  },
}

export const Size: StoryObj<typeof ControlledActionDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof ControlledActionDialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledActionDialog
          {...args}
          firstFocusTarget={buttonRef}
          isOpen={open}
          onPressEscape={handleClose}
        >
          <Button ref={buttonRef}>button要素</Button>
        </ControlledActionDialog>
      </>
    )
  },
}
