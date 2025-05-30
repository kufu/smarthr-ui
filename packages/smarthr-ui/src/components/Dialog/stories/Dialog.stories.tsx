import { useRef, useState } from 'react'

import { Button } from '../../Button'
import { Checkbox } from '../../Checkbox'
import { Input } from '../../Input'
import { Dialog } from '../Dialog'
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
  title: 'Dialog（ダイアログ）/Dialog',
  component: Dialog,
  subcomponents: { DialogWrapper, DialogTrigger, DialogContent, DialogCloser },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <Dialog {...args} isOpen={open}>
          ダイアログコンテンツ
          <Button onClick={() => setOpen(false)}>閉じる</Button>
        </Dialog>
      </>
    )
  },
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
} as Meta<typeof Dialog>

export const Playground: StoryObj<typeof Dialog> = {}

export const Id: StoryObj<typeof Dialog> = {
  name: 'id',
  args: {
    id: 'dialog-story-id',
  },
}

export const Width: StoryObj<typeof Dialog> = {
  name: 'width',
  args: {
    width: _widthOptions.string,
  },
}

export const FirstFocusTarget: StoryObj<typeof Dialog> = {
  name: 'firstFocusTarget',
  render: (args) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <Dialog {...args} firstFocusTarget={inputRef} isOpen={open} onPressEscape={handleClose}>
          <label>
            入力要素
            {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control */}
            <Input ref={inputRef} />
          </label>
        </Dialog>
      </>
    )
  },
}

export const IsOpen: StoryObj<typeof Dialog> = {
  name: 'isOpen',
  render: (args) => {
    const [open, setOpen] = useState(args.isOpen || false)
    const renderCheckbox = (
      <>
        <p>isOpen: {String(open)}</p>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <Checkbox checked={open} onChange={() => setOpen(!open)}>
          isOpen
        </Checkbox>
      </>
    )

    return (
      <>
        {renderCheckbox}
        <Dialog {...args} isOpen={open}>
          {renderCheckbox}
        </Dialog>
      </>
    )
  },
}

export const OnClickOverlay: StoryObj<typeof Dialog> = {
  name: 'onClickOverlay',
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <Dialog {...args} isOpen={open} onClickOverlay={() => setOpen(false)}>
          ダイアログコンテンツ
        </Dialog>
      </>
    )
  },
}

export const OnPressEscape: StoryObj<typeof Dialog> = {
  name: 'onPressEscape',
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        <Dialog {...args} isOpen={open} onPressEscape={() => setOpen(false)}>
          ダイアログコンテンツ
        </Dialog>
      </>
    )
  },
}

export const PortalParent: StoryObj<typeof Dialog> = {
  name: 'portalParent',
  render: (args) => {
    const [open, setOpen] = useState(false)
    const parentRef = useRef<HTMLDivElement>(null)
    return (
      <>
        <div className="shr-px-1.5 shr-py-2" ref={parentRef}>
          <Button onClick={() => setOpen(true)}>ダイアログを開く</Button>
        </div>
        <Dialog {...args} isOpen={open} portalParent={parentRef}>
          ダイアログコンテンツ
          <Button onClick={() => setOpen(false)}>閉じる</Button>
        </Dialog>
      </>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}
