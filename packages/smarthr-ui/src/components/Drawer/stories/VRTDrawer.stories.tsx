import { Button } from '../../Button'
import { Drawer } from '../Drawer'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { DrawerHeader } from '../DrawerHeader'

import { IsOpen } from './Drawer.stories'

import type { DrawerSize } from '../drawerSize'
import type { DrawerPosition } from '../types'
import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Drawer/VRT',
  args: {
    isOpen: true,
  },
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
    <Drawer isOpen modality="modeless" position="right">
      {drawerChildren(() => {})}
    </Drawer>
  ),
}

const SIZES: DrawerSize[] = ['S', 'M', 'L', 'FULL']

const sizeStory = (
  size: DrawerSize,
  position: DrawerPosition = 'right',
): StoryObj<typeof Drawer> => ({
  name: `size: ${size}`,
  render: () => (
    <Drawer isOpen position={position} size={size}>
      {drawerChildren(() => {})}
    </Drawer>
  ),
})

export const SizeS = sizeStory(SIZES[0])
export const SizeM = sizeStory(SIZES[1])
export const SizeL = sizeStory(SIZES[2])
export const SizeFull = sizeStory(SIZES[3])

/**
 * modal では children が FocusTrap に包まれる。ここでボックスが挟まると
 * DrawerBody がスクロールせず、DrawerFooter がパネル外へ押し出される。
 * jsdom はレイアウトしないため、この崩れを捕まえられるのは VRT だけ。
 */
export const BottomLongContent: StoryObj<typeof Drawer> = {
  name: 'bottom / 長いコンテンツ（既定の modality）',
  render: () => (
    <Drawer isOpen position="bottom">
      <DrawerHeader subtitle="サブタイトル" title="ドロワータイトル" />
      <DrawerBody>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>行 {i + 1}：ドロワーの長いコンテンツです。</p>
        ))}
      </DrawerBody>
      <DrawerFooter>
        <Button>キャンセル</Button>
        <Button variant="primary">保存</Button>
      </DrawerFooter>
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
