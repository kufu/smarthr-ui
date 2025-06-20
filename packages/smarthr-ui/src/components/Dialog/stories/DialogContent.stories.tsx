import { useRef } from 'react'

import { Button } from '../../Button'
import { Input } from '../../Input'
import { DialogCloser } from '../DialogCloser'
import { DialogContent } from '../DialogContent'
import { DialogTrigger } from '../DialogTrigger'
import { DialogWrapper } from '../DialogWrapper'

import type { Meta, StoryObj } from '@storybook/react'

const _widthOptions = {
  string: '30em',
  number: 240,
}

export default {
  title: 'Components/Dialog/DialogContent',
  component: DialogContent,
  render: (args) => (
    <DialogWrapper>
      <DialogTrigger>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogCloser>
          <Button>閉じる</Button>
        </DialogCloser>
      </DialogContent>
    </DialogWrapper>
  ),
  argTypes: {
    width: {
      control: 'radio',
      options: Object.keys(_widthOptions),
      mapping: _widthOptions,
    },
    portalParent: {
      control: false,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DialogContent>

export const Playground: StoryObj<typeof DialogContent> = {}

export const Id: StoryObj<typeof DialogContent> = {
  name: 'id',
  args: {
    id: 'dialog-story-id',
  },
}

export const Width: StoryObj<typeof DialogContent> = {
  name: 'width（非推奨）',
  args: {
    width: _widthOptions.number,
  },
}

export const Size: StoryObj<typeof DialogContent> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const FirstFocusTarget: StoryObj<typeof DialogContent> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null)
    return (
      <DialogWrapper>
        <DialogTrigger>
          <Button>ダイアログを開く</Button>
        </DialogTrigger>
        <DialogContent {...args} firstFocusTarget={inputRef}>
          <label>
            入力要素
            <Input ref={inputRef} />
          </label>
          <DialogCloser>
            <Button>閉じる</Button>
          </DialogCloser>
        </DialogContent>
      </DialogWrapper>
    )
  },
}

export const PortalParent: StoryObj<typeof DialogContent> = {
  name: 'portalParent',
  render: (args) => {
    const parentRef = useRef<HTMLDivElement>(null)
    return (
      <>
        <div ref={parentRef} />
        <DialogWrapper>
          <DialogTrigger>
            <Button>ダイアログを開く</Button>
          </DialogTrigger>
          <DialogContent {...args} portalParent={parentRef}>
            <DialogCloser>
              <Button>閉じる</Button>
            </DialogCloser>
          </DialogContent>
        </DialogWrapper>
      </>
    )
  },
}
