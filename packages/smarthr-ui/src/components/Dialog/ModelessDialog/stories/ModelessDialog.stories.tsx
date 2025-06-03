import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import { useState, useRef } from 'react'
import { Button } from '../../../Button'
import { ModelessDialog } from '../ModelessDialog'

export default {
  title: 'Components/Dialog/ModelessDialog',
  component: ModelessDialog,
  render: ({ title, onClickClose, ...args }) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <ModelessDialog
          {...args}
          title={title || 'モードレスダイアログ'}
          isOpen={open}
          onClickClose={onClickClose ?? (() => setOpen(false))}
        >
          ダイアログコンテンツ
        </ModelessDialog>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ModelessDialog>

export const Playground: StoryObj<typeof ModelessDialog> = {}

export const Title: StoryObj<typeof ModelessDialog> = {
  name: 'title',
  args: {
    title: 'モードレスダイアログのタイトル',
  },
}

export const Footer: StoryObj<typeof ModelessDialog> = {
  name: 'footer',
  args: {
    footer: 'ダイアログフッター',
  },
}

export const OnClickClose: StoryObj<typeof ModelessDialog> = {
  name: 'onClickClose',
  args: {
    onClickClose: action('onClickClose'),
  },
}

export const OnPressEscape: StoryObj<typeof ModelessDialog> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: action('onPressEscape'),
  },
}

export const Width: StoryObj<typeof ModelessDialog> = {
  name: 'width',
  args: {
    width: '20em',
  },
}

export const Height: StoryObj<typeof ModelessDialog> = {
  name: 'height',
  args: {
    height: '10em',
  },
}

export const Top: StoryObj<typeof ModelessDialog> = {
  name: 'top',
  args: {
    top: 0,
  },
}

export const Left: StoryObj<typeof ModelessDialog> = {
  name: 'left',
  args: {
    left: 0,
  },
}

export const Right: StoryObj<typeof ModelessDialog> = {
  name: 'right',
  args: {
    right: 0,
  },
}

export const Bottom: StoryObj<typeof ModelessDialog> = {
  name: 'bottom',
  args: {
    bottom: 0,
  },
}

export const PortalParent: StoryObj<typeof ModelessDialog> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    return (
      <>
        <div ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <ModelessDialog
          {...args}
          title="ポータルに開いたダイアログ"
          portalParent={parentRef}
          isOpen={open}
          onClickClose={() => setOpen(false)}
        >
          ダイアログコンテンツ
        </ModelessDialog>
      </>
    )
  },
}

export const ContentBgColor: StoryObj<typeof ModelessDialog> = {
  name: 'contentBgColor',
  args: {
    contentBgColor: 'BACKGROUND',
  },
}

export const ContentPadding: StoryObj<typeof ModelessDialog> = {
  name: 'contentPadding',
  args: {
    contentPadding: {
      block: 1,
      inline: 1.5,
    },
  },
}

export const Resizable: StoryObj<typeof ModelessDialog> = {
  name: 'resizable',
  args: {
    resizable: true,
  },
}
