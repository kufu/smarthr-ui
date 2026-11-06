import { useState } from 'react'

import { Button } from '../../Button'
import { ControlledDrawer } from '../ControlledDrawer'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { DrawerHeader } from '../client'

import { IsOpen } from './ControlledDrawer.stories'

import type { DrawerSize } from '../drawerSize'
import type { DrawerPosition } from '../types'
import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Drawer/ControlledDrawer/VRT',
  args: {
    isOpen: true,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledDrawer>

const drawerChildren = (handleClose: () => void) => (
  <>
    <DrawerHeader subtitle="サブタイトル" title="ドロワータイトル" />
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

export const Right: StoryObj<typeof ControlledDrawer> = {
  render: () => (
    <ControlledDrawer isOpen position="right">
      {drawerChildren(() => {})}
    </ControlledDrawer>
  ),
}

export const Left: StoryObj<typeof ControlledDrawer> = {
  render: () => (
    <ControlledDrawer isOpen position="left">
      {drawerChildren(() => {})}
    </ControlledDrawer>
  ),
}

export const Bottom: StoryObj<typeof ControlledDrawer> = {
  render: () => (
    <ControlledDrawer isOpen position="bottom">
      {drawerChildren(() => {})}
    </ControlledDrawer>
  ),
}

export const ModelessRight: StoryObj<typeof ControlledDrawer> = {
  render: () => (
    <ControlledDrawer isOpen modality="modeless" position="right">
      {drawerChildren(() => {})}
    </ControlledDrawer>
  ),
}

const sizeStory = (
  size: DrawerSize,
  position: DrawerPosition = 'right',
): StoryObj<typeof ControlledDrawer> => ({
  name: `size: ${size}`,
  render: () => (
    <ControlledDrawer isOpen position={position} size={size}>
      {drawerChildren(() => {})}
    </ControlledDrawer>
  ),
})

export const SizeXS = sizeStory('XS')
export const SizeS = sizeStory('S')
export const SizeM = sizeStory('M')
export const SizeL = sizeStory('L')
export const SizeXL = sizeStory('XL')
export const SizeXXL = sizeStory('XXL')
export const SizeFull = sizeStory('FULL')

/**
 * modal では children が FocusTrap に包まれる。ここでボックスが挟まると
 * DrawerBody がスクロールせず、DrawerFooter がパネル外へ押し出される。
 * jsdom はレイアウトしないため、この崩れを捕まえられるのは VRT だけ。
 */
export const BottomLongContent: StoryObj<typeof ControlledDrawer> = {
  render: () => (
    <ControlledDrawer isOpen position="bottom">
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
    </ControlledDrawer>
  ),
}

/**
 * portalParent 内では、幅・高さの上限はビューポートではなくコンテナが基準になる。
 * dvw / dvh のままだとコンテナより広い size を指定したときに親からはみ出し、
 * overflow: hidden なコンテナでは閉じるボタンやヘッダが切れる。
 * jsdom はレイアウトしないため、実寸のはみ出しを捕まえられるのは VRT だけ。
 */
const portalParentStory = (position: DrawerPosition): StoryObj<typeof ControlledDrawer> => ({
  render: () => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    return (
      <div
        ref={setContainer}
        style={{
          position: 'relative',
          width: '24rem',
          height: '24rem',
          border: '1px solid #ccc',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem' }}>コンテナの内側だけを覆います。</div>
        <ControlledDrawer
          isOpen
          modality="modeless"
          portalParent={container ?? undefined}
          position={position}
          size="L"
        >
          {drawerChildren(() => {})}
        </ControlledDrawer>
      </div>
    )
  },
})

export const PortalParentRight = portalParentStory('right')
export const PortalParentLeft = portalParentStory('left')
export const PortalParentBottom = portalParentStory('bottom')

export const VRT = IsOpen

export const VRTForcedColors: StoryObj<typeof ControlledDrawer> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
