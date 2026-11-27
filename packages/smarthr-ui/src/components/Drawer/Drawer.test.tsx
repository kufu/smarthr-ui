import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { IntlProvider } from '../../intl'
import { Button } from '../Button'

import { ControlledDrawer } from './ControlledDrawer'
import { DrawerBody } from './DrawerBody'
import { DrawerFooter } from './DrawerFooter'
import { RemoteDrawerTrigger } from './RemoteDrawerTrigger'
import { Drawer, DrawerCloser, DrawerForm, DrawerHeader } from './client'

import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react'

const TARGET_ID = 'remote-drawer'

const renderWithIntl = (ui: ReactElement) => render(<IntlProvider locale="ja">{ui}</IntlProvider>)

const renderDrawer = (
  props: Partial<ComponentPropsWithRef<typeof Drawer>> = {},
  {
    trigger = <Button>ドロワーを開く</Button>,
    children = <DrawerBody>ドロワーの内容</DrawerBody>,
  }: { trigger?: ReactElement; children?: ReactNode } = {},
) =>
  renderWithIntl(
    <>
      <RemoteDrawerTrigger targetId={TARGET_ID}>{trigger}</RemoteDrawerTrigger>
      <Drawer {...props} id={TARGET_ID}>
        <DrawerHeader title="リモートドロワー" />
        {children}
      </Drawer>
    </>,
  )

const openButton = () => screen.getByRole('button', { name: 'ドロワーを開く' })
const drawer = () => screen.queryByRole('dialog', { name: 'リモートドロワー' })
const headerCloseButton = () => screen.getByRole('button', { name: '閉じる' })

const waitForClosed = () => waitFor(() => expect(drawer()).toBeNull())

describe('Drawer（RemoteDrawerTrigger で開く）', () => {
  it('トリガーのボタンに aria-haspopup と、Drawer を指す aria-controls が付くこと', () => {
    renderDrawer()

    expect(openButton()).toHaveAttribute('aria-haspopup', 'dialog')
    expect(openButton()).toHaveAttribute('aria-controls', TARGET_ID)
    expect(document.getElementById(TARGET_ID)).not.toBeNull()
  })

  it('トリガーを押すと開き、DrawerHeader の閉じるボタンで閉じること', async () => {
    renderDrawer()

    expect(drawer()).toBeNull()

    await userEvent.click(openButton())
    expect(drawer()).toBeInTheDocument()

    await userEvent.click(headerCloseButton())
    await waitForClosed()
  })

  it('onClickClose を指定すると、close を呼ぶまで閉じないこと', async () => {
    let close: (() => void) | undefined
    renderDrawer({ onClickClose: (c) => (close = c) })

    await userEvent.click(openButton())
    await userEvent.click(headerCloseButton())
    expect(drawer()).toBeInTheDocument()

    close!()
    await waitForClosed()
  })

  it('Escape で閉じ、onPressEscape を指定すると close を呼ぶまで閉じないこと', async () => {
    const onPressEscape = vi.fn()
    const { unmount } = renderDrawer({ onPressEscape })

    await userEvent.click(openButton())
    await userEvent.keyboard('{Escape}')
    expect(onPressEscape).toHaveBeenCalledTimes(1)
    expect(drawer()).toBeInTheDocument()
    unmount()

    renderDrawer()
    await userEvent.click(openButton())
    await userEvent.keyboard('{Escape}')
    await waitForClosed()
  })

  it('onClickOverlay が未指定なら、オーバーレイを押しても閉じないこと', async () => {
    renderDrawer()

    await userEvent.click(openButton())
    await userEvent.click(document.querySelector('.smarthr-ui-Drawer-overlay')!)

    expect(drawer()).toBeInTheDocument()
  })

  it('onClickOverlay で close を呼ぶと、オーバーレイを押して閉じること', async () => {
    renderDrawer({ onClickOverlay: (close) => close() })

    await userEvent.click(openButton())
    await userEvent.click(document.querySelector('.smarthr-ui-Drawer-overlay')!)

    await waitForClosed()
  })

  it('開閉に合わせて onOpen と onClose が呼ばれること', async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    renderDrawer({ onOpen, onClose })

    await userEvent.click(openButton())
    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1))

    await userEvent.click(headerCloseButton())
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1))
  })

  it('トリガーのボタンが disabled なら開かないこと', async () => {
    renderDrawer({}, { trigger: <Button disabled>ドロワーを開く</Button> })

    await userEvent.click(openButton())

    expect(drawer()).toBeNull()
  })

  it('行ごとに id を変えて置くと、押したトリガーの Drawer だけが開くこと', async () => {
    const rows = ['山田', '佐藤']
    renderWithIntl(
      <>
        {rows.map((name) => (
          <div key={name}>
            <RemoteDrawerTrigger targetId={`detail-${name}`}>
              <Button>{name}の詳細</Button>
            </RemoteDrawerTrigger>
            <Drawer id={`detail-${name}`}>
              <DrawerHeader title={`${name}の詳細`} />
            </Drawer>
          </div>
        ))}
      </>,
    )

    await userEvent.click(screen.getByRole('button', { name: '佐藤の詳細' }))

    expect(screen.getByRole('dialog', { name: '佐藤の詳細' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: '山田の詳細' })).toBeNull()
  })
})

describe('DrawerCloser', () => {
  const closerChildren = (
    <DrawerFooter>
      <DrawerCloser>
        <Button>キャンセル</Button>
      </DrawerCloser>
    </DrawerFooter>
  )

  it('包んだボタンを押すと閉じること', async () => {
    renderDrawer({}, { children: closerChildren })

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    await waitForClosed()
  })

  it('Drawer の onClickClose を指定すると、DrawerHeader の閉じるボタンと同じく close を呼ぶまで閉じないこと', async () => {
    let close: (() => void) | undefined
    renderDrawer({ onClickClose: (c) => (close = c) }, { children: closerChildren })

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
    expect(drawer()).toBeInTheDocument()

    close!()
    await waitForClosed()
  })

  it('包んだボタンが disabled なら閉じないこと', async () => {
    renderDrawer(
      {},
      {
        children: (
          <DrawerCloser>
            <Button disabled>キャンセル</Button>
          </DrawerCloser>
        ),
      },
    )

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    expect(drawer()).toBeInTheDocument()
  })

  it('ControlledDrawer の中では onClickClose が呼ばれること', async () => {
    const Wrapper = () => {
      const [isOpen, setIsOpen] = useState(true)

      return (
        <ControlledDrawer isOpen={isOpen} onClickClose={() => setIsOpen(false)}>
          <DrawerHeader title="リモートドロワー" />
          <DrawerCloser>
            <Button>キャンセル</Button>
          </DrawerCloser>
        </ControlledDrawer>
      )
    }
    renderWithIntl(<Wrapper />)

    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    await waitForClosed()
  })
})

describe('DrawerForm', () => {
  const renderFormDrawer = (onSubmit: ComponentPropsWithRef<typeof DrawerForm>['onSubmit']) =>
    renderDrawer(
      {},
      {
        children: (
          <DrawerForm onSubmit={onSubmit}>
            <DrawerBody>
              <input name="name" defaultValue="山田" aria-label="氏名" />
            </DrawerBody>
            <DrawerFooter>
              <Button type="submit">適用</Button>
            </DrawerFooter>
          </DrawerForm>
        ),
      },
    )

  it('送信しても、close を呼ぶまで閉じないこと', async () => {
    const onSubmit = vi.fn()
    renderFormDrawer(onSubmit)

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: '適用' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(drawer()).toBeInTheDocument()
  })

  it('非同期の処理のあとに close を呼ぶと閉じること', async () => {
    renderFormDrawer((_, { close }) => {
      setTimeout(close, 0)
    })

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: '適用' }))

    await waitForClosed()
  })

  it('入力値を送信時のイベントから読めること', async () => {
    let name: FormDataEntryValue | null = null
    renderFormDrawer((e) => {
      name = new FormData(e.currentTarget).get('name')
    })

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: '適用' }))

    expect(name).toBe('山田')
  })

  it('閉じるアニメーション中に続けて送信しても、onSubmit は1回だけ呼ばれること', async () => {
    const onSubmit = vi.fn((_: unknown, { close }: { close: () => void }) => close())
    renderFormDrawer(onSubmit)

    await userEvent.click(openButton())
    const submitButton = screen.getByRole('button', { name: '適用' })
    await userEvent.click(submitButton)
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('close では onClickClose を経由しないこと', async () => {
    const onClickClose = vi.fn()
    renderDrawer(
      { onClickClose },
      {
        children: (
          <DrawerForm onSubmit={(_, { close }) => close()}>
            <Button type="submit">適用</Button>
          </DrawerForm>
        ),
      },
    )

    await userEvent.click(openButton())
    await userEvent.click(screen.getByRole('button', { name: '適用' }))

    await waitForClosed()
    expect(onClickClose).not.toHaveBeenCalled()
  })
})
