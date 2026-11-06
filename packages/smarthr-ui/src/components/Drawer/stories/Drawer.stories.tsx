import { useId } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { RemoteDrawerTrigger } from '../RemoteDrawerTrigger'
import { Drawer, DrawerHeader } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

const confirmClose = (close: () => void) => {
  if (window.confirm('入力内容を破棄しますか？')) {
    close()
  }
}

export default {
  title: 'Components/Drawer',
  component: Drawer,
  subcomponents: {
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
  },
  render: (args) => {
    // Docs では全ストーリーが1ページに並ぶため、id を固定すると1つのトリガーで全部開いてしまう
    const id = useId()

    return (
      <>
        <RemoteDrawerTrigger targetId={id}>
          <Button>ドロワーを開く</Button>
        </RemoteDrawerTrigger>
        <Drawer {...args} id={id}>
          <DrawerHeader subtitle="サブタイトル" title="ドロワータイトル" />
          <DrawerBody>
            <p>ドロワーのコンテンツです。ここにコンテンツを配置します。</p>
          </DrawerBody>
        </Drawer>
      </>
    )
  },
  args: {
    size: 'S',
    onToggle: action('onToggle'),
    onOpen: action('onOpen'),
    onClose: action('onClose'),
  },
  argTypes: {
    position: {
      control: 'radio',
      options: ['right', 'left', 'bottom'],
    },
    size: {
      control: 'radio',
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FULL'],
    },
    portalParent: {
      control: false,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof Drawer>

export const Playground: StoryObj<typeof Drawer> = {}

export const Position: StoryObj<typeof Drawer> = {
  name: 'position',
  args: {
    position: 'left',
  },
}

export const Size: StoryObj<typeof Drawer> = {
  name: 'size',
  args: {
    size: 'M',
  },
}

export const OnClickClose: StoryObj<typeof Drawer> = {
  name: 'onClickClose',
  args: {
    onClickClose: confirmClose,
  },
}

export const OnPressEscape: StoryObj<typeof Drawer> = {
  name: 'onPressEscape',
  args: {
    onPressEscape: confirmClose,
  },
}

export const OnClickOverlay: StoryObj<typeof Drawer> = {
  name: 'onClickOverlay',
  args: {
    onClickOverlay: (close) => close(),
  },
}
