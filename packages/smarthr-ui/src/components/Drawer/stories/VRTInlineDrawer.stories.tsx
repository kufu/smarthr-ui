import { Button } from '../../Button'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { InlineDrawerLayout } from '../InlineDrawerLayout'
import { DrawerHeader, InlineDrawer } from '../client'

import type { InlineDrawerSize } from '../drawerSize'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

export default {
  title: 'Components/Drawer/InlineDrawer/VRT',
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof InlineDrawer>

const noop = () => undefined

const panel = (id: string, isOpen: boolean, size?: InlineDrawerSize) => (
  <InlineDrawer id={id} isOpen={isOpen} size={size} onClickClose={noop}>
    <DrawerHeader subtitle="サブタイトル" title="パネルタイトル" />
    <DrawerBody>
      {Array.from({ length: 40 }, (_, i) => (
        <p key={i}>行 {i + 1}：パネルの長いコンテンツです。</p>
      ))}
    </DrawerBody>
    <DrawerFooter>
      <Button variant="primary">適用</Button>
    </DrawerFooter>
  </InlineDrawer>
)

const main = (
  <div className="shr-p-1">
    {Array.from({ length: 60 }, (_, i) => (
      <p key={i}>メインのコンテンツ {i + 1}</p>
    ))}
  </div>
)

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ height: '30rem', border: '1px solid #ccc' }}>{children}</div>
)

export const Left: StoryObj = {
  render: () => (
    <Frame>
      <InlineDrawerLayout left={panel('vrt-left', true)}>{main}</InlineDrawerLayout>
    </Frame>
  ),
}

export const Right: StoryObj = {
  render: () => (
    <Frame>
      <InlineDrawerLayout right={panel('vrt-right', true)}>{main}</InlineDrawerLayout>
    </Frame>
  ),
}

export const Both: StoryObj = {
  render: () => (
    <Frame>
      <InlineDrawerLayout left={panel('vrt-left', true)} right={panel('vrt-right', true)}>
        {main}
      </InlineDrawerLayout>
    </Frame>
  ),
}

export const Closed: StoryObj = {
  render: () => (
    <Frame>
      <InlineDrawerLayout left={panel('vrt-left', false)} right={panel('vrt-right', false)}>
        {main}
      </InlineDrawerLayout>
    </Frame>
  ),
}

const sizeStory = (size: InlineDrawerSize): StoryObj => ({
  name: `size: ${size}`,
  render: () => (
    <Frame>
      <InlineDrawerLayout right={panel('vrt-right', true, size)}>{main}</InlineDrawerLayout>
    </Frame>
  ),
})

export const SizeS = sizeStory('S')
export const SizeM = sizeStory('M')
export const SizeL = sizeStory('L')

export const VRTForcedColors: StoryObj = {
  ...Both,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
