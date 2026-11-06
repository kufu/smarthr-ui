import { useState } from 'react'

import { Button } from '../../Button'
import { FormControl } from '../../FormGroup'
import { Input } from '../../Input'
import { Panel } from '../../Panel'
import { Table, Td, Th } from '../../Table'
import { ControlledDrawer } from '../ControlledDrawer'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { DrawerHeader } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

// ControlledDrawer に onClickClose を渡せば、配下の DrawerHeader は
// Context 経由で自動的にその閉じ処理を使う（個別に onClickClose を渡す必要はない）。

export default {
  title: 'Components/Drawer/ControlledDrawer',
  component: ControlledDrawer,
  subcomponents: {
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
        <ControlledDrawer
          {...args}
          isOpen={open}
          onClickClose={handleClose}
          onPressEscape={handleClose}
        >
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
        </ControlledDrawer>
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
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FULL'],
    },
    portalParent: {
      control: false,
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof ControlledDrawer>

export const Playground: StoryObj<typeof ControlledDrawer> = {}

export const IsOpen: StoryObj<typeof ControlledDrawer> = {
  name: 'isOpen',
  render: (args) => {
    const [open, setOpen] = useState(args.isOpen || false)
    const handleClose = () => setOpen(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>ドロワーを開く</Button>
        <ControlledDrawer
          {...args}
          isOpen={open}
          onClickClose={handleClose}
          onPressEscape={handleClose}
        >
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
        </ControlledDrawer>
      </>
    )
  },
}

/**
 * `modeless` ではオーバーレイを描画せず、背後を操作できる。フォーカストラップと
 * body のスクロールロックも行わない。既定は `modal`。
 *
 * `portalParent` を指定しない `modeless` は画面端に固定されるため、グローバルヘッダに
 * 重なる点に注意。領域内へ収めたい場合は `portalParent` を使う。
 */
export const Modeless: StoryObj<typeof ControlledDrawer> = {
  name: 'modality',
  render: () => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>詳細パネルを開く</Button>
        <p>背後のこの領域は、パネルを開いたままスクロール・操作できます。</p>
        <ControlledDrawer
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
        </ControlledDrawer>
      </>
    )
  },
}

/**
 * `position: relative` なコンテナを `portalParent` に渡すと、その領域内に収まる。
 * このとき幅・高さの上限はビューポートではなくコンテナ基準になるため、コンテナより
 * 広い `size` を指定してもはみ出さない（下の例は 24rem のコンテナに `size="L"`）。
 */
export const PortalParent: StoryObj<typeof ControlledDrawer> = {
  name: 'portalParent',
  render: () => {
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    return (
      <div
        ref={setContainer}
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
        <ControlledDrawer
          isOpen={open}
          position="right"
          portalParent={container ?? undefined}
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
        </ControlledDrawer>
      </div>
    )
  },
}

const ROWS = Array.from({ length: 30 }, (_, i) => i + 1)

/**
 * 一覧の `Panel` を `portalParent` にすると、一覧の右端に重なって開く。
 * ページをスクロールしても見出しは画面の上端に、フッターは画面の下端に残る。
 * `Panel` の角丸に合わせて切り抜くため `overflow="clip"` を指定している（`hidden` だと張り付かない）。
 */
export const PortalParentInPage: StoryObj<typeof ControlledDrawer> = {
  name: 'portalParent（ページの一部に出す）',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [open, setOpen] = useState(true)
    const handleClose = () => setOpen(false)
    const [container, setContainer] = useState<HTMLDivElement | null>(null)

    return (
      <div style={{ padding: '2rem' }}>
        <Button onClick={() => setOpen(true)}>詳細パネルを開く</Button>
        <p>ページをスクロールしても、パネルの見出しとフッターは画面内に残ります。</p>
        <Panel ref={setContainer} overflow="clip" className="shr-relative">
          <Table>
            <thead>
              <tr>
                <Th>社員番号</Th>
                <Th>氏名</Th>
                <Th>部署</Th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((n) => (
                <tr key={n}>
                  <Td>{String(n).padStart(5, '0')}</Td>
                  <Td>従業員 {n}</Td>
                  <Td>開発部</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>
        <ControlledDrawer
          isOpen={open}
          position="right"
          portalParent={container ?? undefined}
          modality="modeless"
          size="S"
          onClickClose={handleClose}
        >
          <DrawerHeader title="詳細" />
          <DrawerBody>
            {ROWS.slice(0, 20).map((n) => (
              <FormControl key={n} label={`項目 ${n}`}>
                <Input name={`field-${n}`} />
              </FormControl>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="primary" onClick={handleClose}>
              保存
            </Button>
          </DrawerFooter>
        </ControlledDrawer>
      </div>
    )
  },
}
