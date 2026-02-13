import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { ActionDialog } from '../ActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/ActionDialog',
  component: ActionDialog,
  render: ({ onClickAction, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleAction = onClickAction
      ? () => onClickAction(() => setOpen(false))
      : () => setOpen(false)
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ActionDialog
          {...rest}
          onClickClose={handleClose}
          onClickAction={handleAction}
          isOpen={open}
        >
          ダイアログコンテンツ
        </ActionDialog>
      </>
    )
  },
  args: {
    heading: 'ダイアログタイトル',
    actionText: 'アクションボタンラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ActionDialog>

export const Playground: StoryObj<typeof ActionDialog> = {}

export const Heading: StoryObj<typeof ActionDialog> = {
  name: 'heading',
  args: {
    heading: 'ダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof ActionDialog> = {
  name: 'Heading.sub',
  args: {
    heading: {
      text: 'ダイアログタイトル',
      sub: 'ダイアログサブタイトル',
    },
  },
}

export const ContentBgColor: StoryObj<typeof ActionDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof ActionDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionText: StoryObj<typeof ActionDialog> = {
  name: 'actionText',
  args: {
    actionText: '保存',
  },
}

export const ActionTheme: StoryObj<typeof ActionDialog> = {
  name: 'actionTheme',
  args: {
    actionTheme: 'danger',
  },
}

export const OnClickAction: StoryObj<typeof ActionDialog> = {
  name: 'onClickAction',
  args: {
    onClickAction: (closeDialog) => {
      action('onClickAction')
      closeDialog()
    },
  },
}

export const OnClickClose: StoryObj<typeof ActionDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof ActionDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const ResponseStatus: StoryObj<typeof ActionDialog> = {
  name: 'responseStatus',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof ActionDialog>['responseStatus']>()

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ActionDialog
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
        </ActionDialog>
      </>
    )
  },
}

export const ActionDisabled: StoryObj<typeof ActionDialog> = {
  name: 'actionDisabled',
  args: {
    actionDisabled: true,
  },
}

export const CloseDisabled: StoryObj<typeof ActionDialog> = {
  name: 'closeDisabled',
  args: {
    closeDisabled: true,
  },
}

export const SubActionArea: StoryObj<typeof ActionDialog> = {
  name: 'subActionArea',
  args: {
    subActionArea: <Button onClick={action('subActionArea')}>サブアクション</Button>,
    width: '40em',
  },
}

export const PortalParent: StoryObj<typeof ActionDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <ActionDialog
          {...args}
          portalParent={parentRef}
          isOpen={open}
          onClickClose={() => setOpen(false)}
        >
          ダイアログコンテンツ
        </ActionDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof ActionDialog> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.string,
  },
}

export const Size: StoryObj<typeof ActionDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof ActionDialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ActionDialog
          {...args}
          firstFocusTarget={buttonRef}
          isOpen={open}
          onPressEscape={handleClose}
        >
          <Button ref={buttonRef}>button要素</Button>
        </ActionDialog>
      </>
    )
  },
}
