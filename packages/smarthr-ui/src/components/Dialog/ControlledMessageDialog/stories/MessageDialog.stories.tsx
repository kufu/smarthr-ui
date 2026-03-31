import { useRef, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { ControlledMessageDialog } from '../ControlledMessageDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/ControlledMessageDialog',
  component: ControlledMessageDialog,
  render: ({ onClickClose, ...rest }) => {
    const [open, setOpen] = useState(false)
    const handleClose = onClickClose ?? (() => setOpen(false))

    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ControlledMessageDialog {...rest} onClickClose={handleClose} isOpen={open} />
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
} as Meta<typeof ControlledMessageDialog>

export const Playground: StoryObj<typeof ControlledMessageDialog> = {}

export const Heading: StoryObj<typeof ControlledMessageDialog> = {
  name: 'heading',
  args: {
    heading: 'メッセージダイアログタイトル',
  },
}

export const HeadingSub: StoryObj<typeof ControlledMessageDialog> = {
  name: 'heading.sub',
  args: {
    heading: {
      text: 'メッセージダイアログタイトル',
      sub: 'メッセージダイアログサブタイトル',
    },
  },
}

export const Children: StoryObj<typeof ControlledMessageDialog> = {
  name: 'children',
  args: {
    children: <p>メッセージダイアログの本文です。React ノードを渡せます。</p>,
  },
}

export const ContentBgColor: StoryObj<typeof ControlledMessageDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof ControlledMessageDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const OnClickClose: StoryObj<typeof ControlledMessageDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof ControlledMessageDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const PortalParent: StoryObj<typeof ControlledMessageDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <ControlledMessageDialog
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

export const Width: StoryObj<typeof ControlledMessageDialog> = {
  name: 'width（非推奨）',
  args: {
    width: '40em',
  },
}

export const Size: StoryObj<typeof ControlledMessageDialog> = {
  name: 'size',
  args: {
    size: 'M',
  },
}
