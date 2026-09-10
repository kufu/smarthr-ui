import { Button } from '../../Button'
import { Drawer } from '../Drawer'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { DrawerHeader } from '../DrawerHeader'

import { IsOpen } from './Drawer.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Drawer/VRT',
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Drawer>

const drawerChildren = (handleClose: () => void) => (
  <>
    <DrawerHeader subtitle="サブタイトル" title="ドロワータイトル" onClickClose={handleClose} />
    <DrawerBody>
      <p>ドロワーのコンテンツです。ここにコンテンツを配置します。</p>
    </DrawerBody>
    <DrawerFooter>
      <Button onClick={handleClose}>キャンセル</Button>
      <Button variant="primary" onClick={handleClose}>
        保存
      </Button>
    </DrawerFooter>
  </>
)

export const Right: StoryObj<typeof Drawer> = {
  render: () => (
    <Drawer isOpen position="right">
      {drawerChildren(() => {})}
    </Drawer>
  ),
}

export const Left: StoryObj<typeof Drawer> = {
  render: () => (
    <Drawer isOpen position="left">
      {drawerChildren(() => {})}
    </Drawer>
  ),
}

export const Bottom: StoryObj<typeof Drawer> = {
  render: () => (
    <Drawer isOpen position="bottom">
      {drawerChildren(() => {})}
    </Drawer>
  ),
}

export const ModelessRight: StoryObj<typeof Drawer> = {
  render: () => (
    <Drawer isOpen position="right" variant="modeless">
      {drawerChildren(() => {})}
    </Drawer>
  ),
}

export const VRT = IsOpen

export const VRTForcedColors: StoryObj<typeof Drawer> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
