import { useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { UnrecommendedMessageDialog } from '../UnrecommendedMessageDialog'
import { UnrecommendedMessageDialogContent } from '../UnrecommendedMessageDialogContent'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/UnrecommendedMessageDialog',
  component: UnrecommendedMessageDialog,
  subcomponents: { UnrecommendedMessageDialogContent },
  render: ({ onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <UnrecommendedMessageDialog {...rest} onClickClose={handleClose} isOpen={open} />
      </>
    )
  },
  args: {
    heading: 'メッセージダイアログタイトル',
    children: 'メッセージダイアログ本文',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof UnrecommendedMessageDialog>

export const Playground: StoryObj<typeof UnrecommendedMessageDialog> = {}

export const Heading: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'heading',
  args: {
    heading: 'メッセージダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'メッセージダイアログタイトル',
      sub: 'メッセージダイアログサブタイトル',
    },
  },
}

export const Children: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'children',
  args: {
    children: <p>メッセージダイアログの本文です。React ノードを渡せます。</p>,
  },
}

export const ContentBgColor: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const OnClickClose: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const PortalParent: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <UnrecommendedMessageDialog
          {...args}
          portalParent={parentRef}
          isOpen={open}
          onClickClose={() => setOpen(false)}
        />
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export const Width: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'width（非推奨）',
  args: {
    width: '40em',
  },
}

export const Size: StoryObj<typeof UnrecommendedMessageDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}
