import { type ComponentProps, useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { Cluster } from '../../../Layout'
import { RadioButton } from '../../../RadioButton'
import { UnrecommendedActionDialog } from '../UnrecommendedActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/UnrecommendedActionDialog',
  component: UnrecommendedActionDialog,
  render: ({ onClickAction, onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleAction = onClickAction
      ? (e: React.MouseEvent, helpers: { close: () => void }) => onClickAction(e, helpers)
      : (_: React.MouseEvent, { close }: { close: () => void }) => close()
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <UnrecommendedActionDialog
          {...rest}
          onClickClose={handleClose}
          onClickAction={handleAction}
          isOpen={open}
        >
          ダイアログコンテンツ
        </UnrecommendedActionDialog>
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
} satisfies Meta<typeof UnrecommendedActionDialog>

export const Playground: StoryObj<typeof UnrecommendedActionDialog> = {}

export const Heading: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'heading',
  args: {
    heading: 'ダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'Heading.sub',
  args: {
    heading: {
      text: 'ダイアログタイトル',
      sub: 'ダイアログサブタイトル',
    },
  },
}

export const ContentBgColor: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const ActionText: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'actionText',
  args: {
    actionText: '保存',
  },
}

export const ActionTheme: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'actionTheme',
  args: {
    actionTheme: 'danger',
  },
}

export const OnClickAction: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'onClickAction',
  args: {
    onClickAction: (e, { close }) => {
      action('onClickAction')(e)
      close()
    },
  },
}

export const OnClickClose: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const ResponseStatus: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'responseStatus',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [responseStatus, setResponseStatus] =
      useState<ComponentProps<typeof UnrecommendedActionDialog>['responseStatus']>()

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <UnrecommendedActionDialog
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
        </UnrecommendedActionDialog>
      </>
    )
  },
}

export const ActionDisabled: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'actionDisabled',
  args: {
    actionDisabled: true,
  },
}

export const CloseDisabled: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'closeDisabled',
  args: {
    closeDisabled: true,
  },
}

export const SubActionArea: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'subActionArea',
  args: {
    subActionArea: <Button onClick={action('subActionArea')}>サブアクション</Button>,
    width: '40em',
  },
}

export const PortalParent: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <UnrecommendedActionDialog
          {...args}
          portalParent={parentRef}
          isOpen={open}
          onClickClose={() => setOpen(false)}
        >
          ダイアログコンテンツ
        </UnrecommendedActionDialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.string,
  },
}

export const Size: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof UnrecommendedActionDialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <UnrecommendedActionDialog
          {...args}
          firstFocusTarget={buttonRef}
          isOpen={open}
          onPressEscape={handleClose}
        >
          <Button ref={buttonRef}>button要素</Button>
        </UnrecommendedActionDialog>
      </>
    )
  },
}
