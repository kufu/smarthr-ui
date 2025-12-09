import { action } from 'storybook/actions'

import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import { Button } from '../../../Button'
import { MessageDialog } from '../MessageDialog'
import { MessageDialogContent } from '../MessageDialogContent'

export default {
  title: 'Components/Dialog/MessageDialog',
  component: MessageDialog,
  subcomponents: { MessageDialogContent },
  render: ({ onClickClose, ...args }) => {
    const [open, setOpen] = useState(false)
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <MessageDialog {...args} onClickClose={handleClose} isOpen={open} />
      </>
    )
  },
  argTypes: {
    titleTag: {
      name: 'titleTag（非推奨）',
    },
  },
  args: {
    title: 'メッセージダイアログタイトル',
    children: 'メッセージダイアログ本文',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof MessageDialog>

export const Playground: StoryObj<typeof MessageDialog> = {}

export const Title: StoryObj<typeof MessageDialog> = {
  name: 'title',
  args: {
    title: 'メッセージダイアログタイトル',
  },
}

export const Subtitle: StoryObj<typeof MessageDialog> = {
  name: 'subtitle',
  args: {
    subtitle: 'メッセージダイアログサブタイトル',
  },
}

export const TitleTag: StoryObj<typeof MessageDialog> = {
  name: 'titleTag（非推奨）',
  args: {
    titleTag: 'h3',
  },
}

export const Children: StoryObj<typeof MessageDialog> = {
  name: 'children',
  args: {
    children: <p>メッセージダイアログの本文です。React ノードを渡せます。</p>,
  },
}

export const ContentBgColor: StoryObj<typeof MessageDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof MessageDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const OnClickClose: StoryObj<typeof MessageDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof MessageDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const PortalParent: StoryObj<typeof MessageDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <MessageDialog
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

export const Width: StoryObj<typeof MessageDialog> = {
  name: 'width（非推奨）',
  args: {
    width: '40em',
  },
}

export const Size: StoryObj<typeof MessageDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}
