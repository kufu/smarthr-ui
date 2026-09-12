import { useRef, useState } from 'react'

import { Button } from '../../Button'
import { Drawer } from '../Drawer'
import { DrawerBody } from '../DrawerBody'
import { DrawerCloser } from '../DrawerCloser'
import { DrawerContent } from '../DrawerContent'
import { DrawerFooter } from '../DrawerFooter'
import { DrawerHeader } from '../DrawerHeader'
import { DrawerTrigger } from '../DrawerTrigger'
import { DrawerWrapper } from '../DrawerWrapper'

import type { Meta, StoryObj } from '@storybook/react-vite'

// Controlled では Drawer に onClickClose を渡せば、配下の DrawerHeader / DrawerCloser は
// Context 経由で自動的にその閉じ処理を使う（個別に onClickClose を渡す必要はない）。

export default {
  title: 'Components/Drawer',
  component: Drawer,
  subcomponents: {
    DrawerWrapper,
    DrawerTrigger,
    DrawerContent,
    DrawerCloser,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ドロワーを開く</Button>
        <Drawer {...args} isOpen={open} onClickClose={handleClose} onPressEscape={handleClose}>
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
        </Drawer>
      </>
    )
  },
  argTypes: {
    modality: {
      control: 'radio',
      options: ['modal', 'modeless'],
    },
    position: {
      control: 'radio',
      options: ['right', 'left', 'bottom'],
    },
    size: {
      control: 'radio',
      options: ['S', 'M', 'L', 'FULL'],
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

export const IsOpen: StoryObj<typeof Drawer> = {
  name: 'isOpen',
  render: (args) => {
    const [open, setOpen] = useState(args.isOpen || false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ドロワーを開く</Button>
        <Drawer {...args} isOpen={open} onClickClose={handleClose} onPressEscape={handleClose}>
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
        </Drawer>
      </>
    )
  },
}

/**
 * Uncontrolled な使い方。`DrawerWrapper` でラップし、`DrawerTrigger` で開き、
 * `DrawerCloser` や `DrawerHeader` の閉じるボタンで閉じる。開閉状態を自分で管理する必要がない。
 */
export const Uncontrolled: StoryObj<typeof Drawer> = {
  name: 'Uncontrolled（Wrapper + Trigger）',
  render: () => (
    <DrawerWrapper>
      <DrawerTrigger>
        <Button>ドロワーを開く</Button>
      </DrawerTrigger>
      <DrawerContent position="right" size="M">
        <DrawerHeader subtitle="サブタイトル" title="ドロワータイトル" />
        <DrawerBody>
          <p>Uncontrolled なドロワーです。開閉状態は内部で管理されます。</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerCloser>
            <Button>キャンセル</Button>
          </DrawerCloser>
          <DrawerCloser>
            <Button variant="primary">保存</Button>
          </DrawerCloser>
        </DrawerFooter>
      </DrawerContent>
    </DrawerWrapper>
  ),
}

/**
 * `modeless` ではオーバーレイを描画せず、背後を操作できる。フォーカストラップと
 * body のスクロールロックも行わない。既定は `modal`。
 *
 * `portalParent` を指定しない `modeless` は画面端に固定されるため、グローバルヘッダに
 * 重なる点に注意。領域内へ収めたい場合は `portalParent` を使う。
 */
export const Modeless: StoryObj<typeof Drawer> = {
  name: 'modality',
  render: () => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>詳細パネルを開く</Button>
        <p>背後のこの領域は、パネルを開いたままスクロール・操作できます。</p>
        <Drawer
          isOpen={open}
          position="right"
          modality="modeless"
          size="S"
          ariaLabel="モードレス詳細パネル"
          onClickClose={handleClose}
          onPressEscape={handleClose}
        >
          <DrawerHeader subtitle="背後を操作できます" title="詳細" />
          <DrawerBody>
            <p>オーバーレイが無いため、背後の一覧を見ながら操作できます。</p>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={handleClose}>閉じる</Button>
          </DrawerFooter>
        </Drawer>
      </>
    )
  },
}

/**
 * `position: relative` なコンテナを `portalParent` に渡すと、その領域内に収まる。
 * このとき幅・高さの上限はビューポートではなくコンテナ基準になるため、コンテナより
 * 広い `size` を指定してもはみ出さない（下の例は 24rem のコンテナに `size="L"`）。
 */
export const PortalParent: StoryObj<typeof Drawer> = {
  name: 'portalParent',
  render: () => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: '24rem',
          border: '1px solid #ccc',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem' }}>
          <Button onClick={() => setOpen(true)}>詳細パネルを開く</Button>
          <p>コンテナの内側だけを覆います。</p>
        </div>
        <Drawer
          isOpen={open}
          position="right"
          portalParent={containerRef}
          modality="modeless"
          size="L"
          ariaLabel="コンテナ内詳細パネル"
          onClickClose={handleClose}
          onPressEscape={handleClose}
        >
          <DrawerHeader subtitle="コンテナ基準で収まります" title="詳細" />
          <DrawerBody>
            <p>{`size="L"`}（880px）を指定していますが、コンテナ幅に収まります。</p>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={handleClose}>閉じる</Button>
          </DrawerFooter>
        </Drawer>
      </div>
    )
  },
}
