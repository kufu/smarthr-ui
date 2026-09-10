import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, Profiler, useRef, useState } from 'react'

import { IntlProvider } from '../../intl'
import { Button } from '../Button'

import { Drawer } from './Drawer'
import { DrawerBody } from './DrawerBody'
import { DrawerCloser } from './DrawerCloser'
import { DrawerContent } from './DrawerContent'
import { DrawerFooter } from './DrawerFooter'
import { DrawerHeader } from './DrawerHeader'
import { DrawerTrigger } from './DrawerTrigger'
import { DrawerWrapper } from './DrawerWrapper'

import type { DrawerPosition } from './types'

// jsdom は PointerEvent 未実装（clientX/clientY 等が抜け落ちる）のため、
// fireEvent.pointerXxx でドラッグ座標を検証できるよう MouseEvent ベースで補う。
// timeStamp も同一 tick 内の連続呼び出しでは常に同じ値になり、速度計算が距離に
// 対して過大になってしまうため、明示的に上書きできるようにする。
if (typeof PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerId?: number
    constructor(type: string, params: PointerEventInit & { timeStamp?: number } = {}) {
      super(type, params)
      this.pointerId = params.pointerId
      if (params.timeStamp !== undefined) {
        Object.defineProperty(this, 'timeStamp', { value: params.timeStamp, configurable: true })
      }
    }
  }
  // @ts-expect-error -- jsdom に PointerEvent が無いため補う
  global.PointerEvent = PointerEventPolyfill
}

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="ja">{ui}</IntlProvider>)

// jsdom はレイアウトしないため getBoundingClientRect が常に 0 を返す。
// swipe-to-dismiss はパネルの実測高を閾値の基準にするので、明示的に与える。
const stubPanelHeight = (height: number) => {
  const dialog = screen.getByRole('dialog')

  vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 390,
    bottom: height,
    width: 390,
    height,
    toJSON: () => ({}),
  })

  return dialog
}

const ControlledTemplate: FC<{ position?: DrawerPosition }> = ({ position }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>open</Button>
      <Drawer
        isOpen={isOpen}
        position={position}
        ariaLabel="テストドロワー"
        onClickClose={() => setIsOpen(false)}
        onClickOverlay={() => setIsOpen(false)}
        onPressEscape={() => setIsOpen(false)}
      >
        <p>drawer content</p>
        <Button onClick={() => setIsOpen(false)}>close</Button>
      </Drawer>
    </>
  )
}

describe('Drawer（Controlled）', () => {
  it('トリガで開き、閉じるボタンで閉じられること', async () => {
    renderWithIntl(<ControlledTemplate />)
    expect(screen.queryByRole('dialog', { name: 'テストドロワー' })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: 'テストドロワー' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'close' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'テストドロワー' })).toBeNull()
    })
  })

  it('Escape キーで onPressEscape が呼ばれ閉じること', async () => {
    renderWithIntl(<ControlledTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: 'テストドロワー' })).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'テストドロワー' })).toBeNull()
    })
  })

  it('オーバーレイクリックで onClickOverlay が呼ばれ閉じること', async () => {
    renderWithIntl(<ControlledTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const overlay = screen
      .getAllByRole('presentation')
      .find((el) => el.classList.contains('smarthr-ui-Drawer-overlay'))
    expect(overlay).toBeTruthy()
    await userEvent.click(overlay as HTMLElement)
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'テストドロワー' })).toBeNull()
    })
  })

  it('role=dialog と aria-modal=true を持つこと', async () => {
    renderWithIntl(<ControlledTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    const dialog = screen.getByRole('dialog', { name: 'テストドロワー' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  // FocusTrap が挟む div がボックスを作ると、dialog の flex コンテキストが途切れて
  // DrawerBody のスクロールと DrawerFooter の固定が効かなくなる。
  it('dialog と body/footer の間に挟まる要素がボックスを作らないこと', async () => {
    renderWithIntl(
      <Drawer isOpen ariaLabel="レイアウト検証">
        <DrawerHeader title="タイトル" />
        <DrawerBody>
          <p>body</p>
        </DrawerBody>
        <DrawerFooter>
          <Button>footer button</Button>
        </DrawerFooter>
      </Drawer>,
    )

    const dialog = screen.getByRole('dialog', { name: 'レイアウト検証' })
    const body = dialog.querySelector('.smarthr-ui-Drawer-body') as HTMLElement
    const footer = dialog.querySelector('.smarthr-ui-Drawer-footer') as HTMLElement
    expect(body).toBeTruthy()
    expect(footer).toBeTruthy()

    for (const target of [body, footer]) {
      for (let el = target.parentElement; el && el !== dialog; el = el.parentElement) {
        expect(el).toHaveClass('shr-contents')
      }
    }
  })
})

describe('Drawer（Uncontrolled）', () => {
  const UncontrolledTemplate: FC = () => (
    <DrawerWrapper>
      <DrawerTrigger>
        <Button>open</Button>
      </DrawerTrigger>
      <DrawerContent ariaLabel="非制御ドロワー">
        <p>uncontrolled content</p>
        <DrawerCloser>
          <Button>close</Button>
        </DrawerCloser>
      </DrawerContent>
    </DrawerWrapper>
  )

  it('トリガで開き、DrawerCloser で閉じられること', async () => {
    renderWithIntl(<UncontrolledTemplate />)
    expect(screen.queryByRole('dialog', { name: '非制御ドロワー' })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: '非制御ドロワー' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'close' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '非制御ドロワー' })).toBeNull()
    })
  })

  it('トリガの aria-expanded が開閉に応じて切り替わること', async () => {
    renderWithIntl(<UncontrolledTemplate />)
    const triggerWrapper = screen.getByRole('button', { name: 'open' }).parentElement
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(triggerWrapper).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Drawer サブコンポーネント', () => {
  it('DrawerHeader の閉じるボタン（×）で閉じられること', async () => {
    const HeaderTemplate: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer isOpen={isOpen} ariaLabel="ヘッダ付き" onClickClose={() => setIsOpen(false)}>
            <DrawerHeader title="タイトル" onClickClose={() => setIsOpen(false)} />
            <DrawerBody>
              <p>body</p>
            </DrawerBody>
            <DrawerFooter>
              <Button>footer button</Button>
            </DrawerFooter>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<HeaderTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: 'ヘッダ付き' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: '閉じる' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'ヘッダ付き' })).toBeNull()
    })
  })

  it('ariaLabel 未指定でも DrawerHeader の見出しで dialog がラベル付けされること', async () => {
    const AutoLabelTemplate: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer isOpen={isOpen} onClickClose={() => setIsOpen(false)}>
            <DrawerHeader title="自動ラベル見出し" onClickClose={() => setIsOpen(false)} />
            <DrawerBody>
              <p>body</p>
            </DrawerBody>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<AutoLabelTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: '自動ラベル見出し' })).toBeVisible()
  })
})

describe('Drawer ドラッグハンドル', () => {
  const VerticalTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>open</Button>
        <Drawer
          isOpen={isOpen}
          position="bottom"
          ariaLabel="ボトムドロワー"
          onClickClose={() => setIsOpen(false)}
        >
          <p>bottom content</p>
        </Drawer>
      </>
    )
  }

  it('bottom では grabber を描画すること', async () => {
    renderWithIntl(<VerticalTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const handle = document.querySelector('.smarthr-ui-Drawer-handle')
    expect(handle).toBeVisible()
  })

  it('grabber がアクセシビリティツリーに現れないこと', async () => {
    renderWithIntl(<VerticalTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const handle = document.querySelector('.smarthr-ui-Drawer-handle') as HTMLElement
    expect(handle).toHaveAttribute('aria-hidden', 'true')
    // aria-hidden 配下も含めて（hidden: true）、grabber は操作可能な要素を持たない
    expect(within(handle).queryAllByRole('button', { hidden: true })).toHaveLength(0)
  })

  const renderBottomDrawer = (onClickClose: () => void = vi.fn()) => {
    renderWithIntl(
      <Drawer isOpen position="bottom" ariaLabel="ボトムドロワー" onClickClose={onClickClose}>
        <p>bottom content</p>
      </Drawer>,
    )

    return {
      onClickClose,
      handle: document.querySelector('.smarthr-ui-Drawer-handle') as HTMLElement,
    }
  }

  // React の SyntheticEvent は timeStamp が falsy だと Date.now() で埋めるため、
  // 0 は使わずに必ず正の値を渡す。
  const DOWN_AT = 1000

  const dragHandle = (
    handle: HTMLElement,
    { to, moveAt = DOWN_AT + 200, upAt = moveAt }: { to: number; moveAt?: number; upAt?: number },
  ) => {
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 0, timeStamp: DOWN_AT })
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: to, timeStamp: moveAt })
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: to, timeStamp: upAt })
  }

  it('grabber を下にドラッグすると onClickClose が呼ばれること', async () => {
    const { onClickClose, handle } = renderBottomDrawer()
    stubPanelHeight(400)

    dragHandle(handle, { to: 300 })

    expect(onClickClose).toHaveBeenCalled()
  })

  it('grabber を少しだけドラッグしても閉じないこと', async () => {
    const { onClickClose, handle } = renderBottomDrawer()
    stubPanelHeight(400)

    dragHandle(handle, { to: 40 })

    expect(onClickClose).not.toHaveBeenCalled()
  })

  // 閾値をビューポート高の初期値に固定していると、回転やリサイズ後のパネルでは
  // ドラッグ量の割合が合わなくなる。掴んだ時点のパネル実測高を基準にする。
  it('閉じ判定がパネルの実測高を基準にすること', async () => {
    const { onClickClose, handle } = renderBottomDrawer()
    // window.innerHeight (jsdom は 768) より十分小さいパネル。
    // 250px は実測高 300 の 83% だが、768 基準なら 33% にしかならない
    stubPanelHeight(300)

    // 1000ms かけてゆっくり動かし、フリック判定ではなく位置判定に載せる
    dragHandle(handle, { to: 250, moveAt: DOWN_AT + 1000 })

    expect(onClickClose).toHaveBeenCalled()
  })

  it('勢いよく動かしても静止してから離せばフリック扱いしないこと', async () => {
    const { onClickClose, handle } = renderBottomDrawer()
    stubPanelHeight(400)

    // 10ms で 20px（= 2px/ms）動かしたあと 190ms 静止してから離す
    dragHandle(handle, { to: 20, moveAt: DOWN_AT + 10, upAt: DOWN_AT + 200 })

    expect(onClickClose).not.toHaveBeenCalled()
  })

  it('勢いよく動かしてすぐ離せばフリックとして閉じること', async () => {
    const { onClickClose, handle } = renderBottomDrawer()
    stubPanelHeight(400)

    dragHandle(handle, { to: 20, moveAt: DOWN_AT + 10 })

    expect(onClickClose).toHaveBeenCalled()
  })

  // onClickClose を受けても isOpen を落とさない利用者（確認ダイアログを挟む等）がいるため、
  // 閉じ位置へ送りっぱなしにすると画面外で操作不能になる
  it('スワイプで閉じたあと isOpen が true のままなら開き位置へ戻ること', async () => {
    const { handle } = renderBottomDrawer(() => undefined)
    const dialog = stubPanelHeight(400)
    await waitFor(() => {
      expect(dialog.style.transform).toBe('translateY(0)')
    })

    dragHandle(handle, { to: 300 })
    expect(dialog.style.transform).toBe('translateY(400px)')

    await waitFor(() => {
      expect(dialog.style.transform).toBe('translateY(0)')
    })
  })

  // Context の値を毎レンダー作り直すと、ドラッグ中（毎フレーム再レンダー）に
  // DrawerHeader（Button / Heading / Text / Icon）まで再描画されてしまう
  it('ドラッグ中に DrawerHeader が再レンダーされないこと', async () => {
    let renderCount = 0
    renderWithIntl(
      <Drawer isOpen position="bottom" ariaLabel="ボトムドロワー" onClickClose={() => undefined}>
        <Profiler
          id="header"
          onRender={() => {
            renderCount += 1
          }}
        >
          <DrawerHeader title="タイトル" />
        </Profiler>
        <DrawerBody>
          <p>body</p>
        </DrawerBody>
      </Drawer>,
    )
    const dialog = stubPanelHeight(400)
    const handle = document.querySelector('.smarthr-ui-Drawer-handle') as HTMLElement

    renderCount = 0
    fireEvent.pointerDown(handle, { pointerId: 1, clientY: 0, timeStamp: 1000 })
    for (let i = 1; i <= 5; i++) {
      fireEvent.pointerMove(handle, { pointerId: 1, clientY: i * 10, timeStamp: 1000 + i * 16 })
    }

    // ドラッグ位置は反映されている（＝再レンダーは起きている）
    expect(dialog.style.transform).toBe('translateY(50px)')
    expect(renderCount).toBe(0)
  })

  it('横方向（right）では grabber を描画しないこと', async () => {
    const HorizontalTemplate: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer
            isOpen={isOpen}
            position="right"
            ariaLabel="右ドロワー"
            onClickClose={() => setIsOpen(false)}
          >
            <p>right content</p>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<HorizontalTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(document.querySelector('.smarthr-ui-Drawer-handle')).toBeNull()
  })
})

describe('Drawer Controlled の close 自動接続', () => {
  it('Controlled でも DrawerHeader に onClickClose を渡さず Context 経由で閉じられること', async () => {
    const Template: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          {/* onClickClose は Drawer にだけ渡し、DrawerHeader には渡さない */}
          <Drawer isOpen={isOpen} ariaLabel="自動close" onClickClose={() => setIsOpen(false)}>
            <DrawerHeader title="タイトル" />
            <DrawerBody>
              <p>body</p>
            </DrawerBody>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<Template />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: '自動close' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: '閉じる' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '自動close' })).toBeNull()
    })
  })
})

describe('Drawer（modeless）', () => {
  const ModelessTemplate: FC<{ onPressEscape?: () => void }> = ({ onPressEscape }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>open</Button>
        <Drawer
          isOpen={isOpen}
          position="right"
          modality="modeless"
          ariaLabel="モードレスドロワー"
          onClickClose={() => setIsOpen(false)}
          onPressEscape={onPressEscape}
        >
          <p>modeless content</p>
          <Button onClick={() => setIsOpen(false)}>close</Button>
        </Drawer>
      </>
    )
  }

  it('オーバーレイを描画しないこと', async () => {
    renderWithIntl(<ModelessTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const overlay = screen
      .queryAllByRole('presentation')
      .find((el) => el.classList.contains('smarthr-ui-Drawer-overlay'))
    expect(overlay).toBeUndefined()
  })

  it('aria-modal を付けないこと（role=dialog は維持）', async () => {
    renderWithIntl(<ModelessTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const dialog = screen.getByRole('dialog', { name: 'モードレスドロワー' })
    expect(dialog).not.toHaveAttribute('aria-modal')
  })

  it('body のスクロールをロックしないこと', async () => {
    renderWithIntl(<ModelessTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(document.body.style.overflow).not.toBe('hidden')
  })

  // modeless でも「開いたらパネル内へフォーカス」は必要（ModelessDialog と同じ）。
  // 省略するのは Tab の循環だけ。
  it('開いたときにドロワー内へフォーカスが移ること', async () => {
    renderWithIntl(<ModelessTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const dialog = screen.getByRole('dialog', { name: 'モードレスドロワー' })

    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })
  })

  it('Tab はドロワー内に閉じ込めないこと（背後へ出られる）', async () => {
    renderWithIntl(<ModelessTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const dialog = screen.getByRole('dialog', { name: 'モードレスドロワー' })

    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    // 末尾まで Tab を送っても循環せず、いずれドロワーの外へ出る
    for (let i = 0; i < 12; i++) {
      await userEvent.tab()
      if (!dialog.contains(document.activeElement)) break
    }

    expect(dialog.contains(document.activeElement)).toBe(false)
  })

  it('modeless でも ×（onClickClose）で閉じられること', async () => {
    renderWithIntl(<ModelessTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: 'モードレスドロワー' })).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'close' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'モードレスドロワー' })).toBeNull()
    })
  })

  // portalParent 内に収める modeless では、bottom の高さの基準はビューポートではなくコンテナ。
  // dvh のままだとコンテナからはみ出して grabber とヘッダが上に切れる。
  it('portalParent 指定の bottom はコンテナ基準の高さになること', async () => {
    const PortalTemplate: FC = () => {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <div ref={containerRef}>
          <Drawer
            isOpen
            position="bottom"
            modality="modeless"
            portalParent={containerRef}
            ariaLabel="コンテナ内ドロワー"
          >
            <p>content</p>
          </Drawer>
        </div>
      )
    }
    renderWithIntl(<PortalTemplate />)

    const dialog = screen.getByRole('dialog', { name: 'コンテナ内ドロワー' })
    expect(dialog).toHaveClass('shr-h-[calc(100%-theme(spacing.2))]')
    expect(dialog).not.toHaveClass('shr-h-[calc(100dvh-theme(spacing.2))]')
  })

  // クラスが正しくても、ポータルが portalParent の外に出ていれば absolute の基準が
  // コンテナにならず意味を成さない。DOM 上の配置そのものを検証する。
  it('portalParent の内側にポータルが生成されること', async () => {
    const PortalTemplate: FC = () => {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <div ref={containerRef} data-testid="portal-parent">
          <Drawer
            isOpen
            position="right"
            modality="modeless"
            portalParent={containerRef}
            ariaLabel="コンテナ内ドロワー"
          >
            <p>content</p>
          </Drawer>
        </div>
      )
    }
    renderWithIntl(<PortalTemplate />)

    const dialog = screen.getByRole('dialog', { name: 'コンテナ内ドロワー' })

    await waitFor(() => {
      expect(screen.getByTestId('portal-parent')).toContainElement(dialog)
    })
  })

  // right/left も同様。指定サイズより狭いコンテナに置くと、dvw 基準のままでは
  // パネルが親からはみ出し、overflow: hidden なコンテナでは閉じるボタンが切れる。
  it('portalParent 指定の right はコンテナ基準の最大幅になること', async () => {
    const PortalTemplate: FC = () => {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <div ref={containerRef}>
          <Drawer
            isOpen
            position="right"
            modality="modeless"
            portalParent={containerRef}
            size="M"
            ariaLabel="コンテナ内右ドロワー"
          >
            <p>content</p>
          </Drawer>
        </div>
      )
    }
    renderWithIntl(<PortalTemplate />)

    const dialog = screen.getByRole('dialog', { name: 'コンテナ内右ドロワー' })
    expect(dialog).toHaveClass('shr-max-w-[calc(100%-theme(spacing.2))]')
    expect(dialog).not.toHaveClass('shr-max-w-[calc(100dvw-theme(spacing.2))]')
  })

  it('portalParent なしの right はビューポート基準の最大幅のままであること', async () => {
    renderWithIntl(
      <Drawer isOpen position="right" modality="modeless" size="M" ariaLabel="画面固定右ドロワー">
        <p>content</p>
      </Drawer>,
    )

    const dialog = screen.getByRole('dialog', { name: '画面固定右ドロワー' })
    expect(dialog).toHaveClass('shr-max-w-[calc(100dvw-theme(spacing.2))]')
  })

  it('portalParent なしの bottom はビューポート基準の高さのままであること', async () => {
    renderWithIntl(
      <Drawer isOpen position="bottom" modality="modeless" ariaLabel="画面固定ドロワー">
        <p>content</p>
      </Drawer>,
    )

    const dialog = screen.getByRole('dialog', { name: '画面固定ドロワー' })
    expect(dialog).toHaveClass('shr-h-[calc(100dvh-theme(spacing.2))]')
  })

  it('modeless でも onPressEscape を渡せば Escape で閉じること', async () => {
    const TemplateWithEscape: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer
            isOpen={isOpen}
            modality="modeless"
            ariaLabel="modeless escape"
            onClickClose={() => setIsOpen(false)}
            onPressEscape={() => setIsOpen(false)}
          >
            <p>content</p>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<TemplateWithEscape />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(screen.getByRole('dialog', { name: 'modeless escape' })).toBeVisible()

    await userEvent.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'modeless escape' })).toBeNull()
    })
  })
})

describe('Drawer（modal 既定の回帰）', () => {
  const DefaultTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>open</Button>
        <Drawer isOpen={isOpen} ariaLabel="モーダルドロワー" onClickClose={() => setIsOpen(false)}>
          <p>modal content</p>
        </Drawer>
      </>
    )
  }

  it('modal（既定）ではオーバーレイを描画すること', async () => {
    renderWithIntl(<DefaultTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const overlay = screen
      .getAllByRole('presentation')
      .find((el) => el.classList.contains('smarthr-ui-Drawer-overlay'))
    expect(overlay).toBeTruthy()
  })

  it('modal（既定）では body のスクロールをロックすること', async () => {
    renderWithIntl(<DefaultTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(document.body.style.overflow).toBe('hidden')
  })
})

describe('Drawer レイアウト基準（modeless の配置）', () => {
  const getLayout = () => document.querySelector('.smarthr-ui-Drawer-layout') as HTMLElement | null

  it('modal（既定）では layout が fixed であること', async () => {
    const Template: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer isOpen={isOpen} ariaLabel="fixed drawer" onClickClose={() => setIsOpen(false)}>
            <p>content</p>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<Template />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(getLayout()).toHaveClass('shr-fixed')
    expect(getLayout()).not.toHaveClass('shr-absolute')
  })

  it('modeless かつ portalParent 指定時は layout が absolute であること', async () => {
    const Template: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      const ref = useRef<HTMLDivElement>(null)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <div ref={ref} style={{ position: 'relative' }} data-testid="container" />
          <Drawer
            isOpen={isOpen}
            portalParent={ref}
            modality="modeless"
            ariaLabel="absolute drawer"
            onClickClose={() => setIsOpen(false)}
          >
            <p>content</p>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<Template />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(getLayout()).toHaveClass('shr-absolute')
    expect(getLayout()).not.toHaveClass('shr-fixed')
  })

  it('modeless でも portalParent 未指定時は layout が fixed であること', async () => {
    const Template: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer
            isOpen={isOpen}
            modality="modeless"
            ariaLabel="modeless fixed"
            onClickClose={() => setIsOpen(false)}
          >
            <p>content</p>
          </Drawer>
        </>
      )
    }
    renderWithIntl(<Template />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    expect(getLayout()).toHaveClass('shr-fixed')
    expect(getLayout()).not.toHaveClass('shr-absolute')
  })
})

describe('Drawer size', () => {
  const SizedTemplate: FC<{ position: 'bottom' | 'right' }> = ({ position }) => (
    <Drawer isOpen position={position} size="M" ariaLabel="サイズ確認">
      <p>content</p>
    </Drawer>
  )

  it('left/right では size のクラスが当たること', () => {
    renderWithIntl(<SizedTemplate position="right" />)
    expect(screen.getByRole('dialog', { name: 'サイズ確認' })).toHaveClass('shr-w-col5')
  })

  it('bottom では size を無視して幅フルにすること', () => {
    renderWithIntl(<SizedTemplate position="bottom" />)
    const dialog = screen.getByRole('dialog', { name: 'サイズ確認' })
    expect(dialog).not.toHaveClass('shr-w-col5')
    expect(dialog).toHaveClass('shr-w-full')
  })
})

describe('Drawer あふれ防止', () => {
  it('left/right にビューポート幅の max ガードが当たること', () => {
    renderWithIntl(
      <Drawer isOpen position="right" size="L" ariaLabel="右ドロワー">
        <p>content</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog', { name: '右ドロワー' })).toHaveClass(
      'shr-max-w-[calc(100dvw-theme(spacing.2))]',
    )
  })

  it('bottom の高さがコンテンツによらず固定されること', () => {
    renderWithIntl(
      <Drawer isOpen position="bottom" ariaLabel="ボトムドロワー">
        <p>content</p>
      </Drawer>,
    )
    expect(screen.getByRole('dialog', { name: 'ボトムドロワー' })).toHaveClass(
      'shr-h-[calc(100dvh-theme(spacing.2))]',
    )
  })
})

// FocusTrap のラッパーに display: contents を当てているため、Dialog 相当の
// フォーカス挙動が保たれているかをここで担保する。ラッパーがボックスを作ると
// tabbable の探索やフォーカス順が崩れうる。
describe('Drawer（modal のフォーカス）', () => {
  const FocusTemplate: FC<{ firstFocusTarget?: boolean }> = ({ firstFocusTarget }) => {
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>open</Button>
        <Drawer
          isOpen={isOpen}
          position="right"
          firstFocusTarget={firstFocusTarget ? inputRef : undefined}
          ariaLabel="フォーカス確認ドロワー"
          onClickClose={() => setIsOpen(false)}
        >
          <DrawerBody>
            <input ref={inputRef} name="first" aria-label="最初の入力" />
            <input name="second" aria-label="次の入力" />
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={() => setIsOpen(false)}>閉じる</Button>
          </DrawerFooter>
        </Drawer>
      </>
    )
  }

  it('開いたときにドロワー内へフォーカスが移ること', async () => {
    renderWithIntl(<FocusTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const dialog = screen.getByRole('dialog', { name: 'フォーカス確認ドロワー' })

    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })
  })

  it('firstFocusTarget を指定した要素にフォーカスできること', async () => {
    renderWithIntl(<FocusTemplate firstFocusTarget />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: '最初の入力' })).toHaveFocus()
    })
  })

  it('Tab がドロワー内で循環すること', async () => {
    renderWithIntl(<FocusTemplate firstFocusTarget />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: '最初の入力' })).toHaveFocus()
    })

    // 末尾（閉じるボタン）から Tab すると先頭へ戻る
    screen.getByRole('button', { name: '閉じる' }).focus()
    await userEvent.tab()

    const dialog = screen.getByRole('dialog', { name: 'フォーカス確認ドロワー' })
    expect(dialog.contains(document.activeElement)).toBe(true)
    expect(screen.getByRole('button', { name: 'open' })).not.toHaveFocus()
  })

  it('閉じたときにトリガへフォーカスが戻ること', async () => {
    renderWithIntl(<FocusTemplate />)
    const trigger = screen.getByRole('button', { name: 'open' })
    await userEvent.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'フォーカス確認ドロワー' })).toBeVisible()
    })

    await userEvent.click(screen.getByRole('button', { name: '閉じる' }))

    await waitFor(() => {
      expect(trigger).toHaveFocus()
    })
  })
})

// 閉じアニメーションの間（TRANSITION_DURATION=400ms）ドロワーは DOM に残り、
// オーバーレイも × ボタンもクリックできてしまう。ここで再発火すると、
// 利用者が setOpen((v) => !v) のように書いている場合に閉じ途中で開き直る。
describe('Drawer（閉じアニメーション中の再発火）', () => {
  const ClosingTemplate: FC<{
    onClickOverlay: () => void
    onClickClose: () => void
  }> = ({ onClickOverlay, onClickClose }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
      <>
        <Button onClick={() => setIsOpen(false)}>外から閉じる</Button>
        <Drawer
          isOpen={isOpen}
          position="right"
          ariaLabel="閉じ中ドロワー"
          onClickClose={onClickClose}
          onClickOverlay={onClickOverlay}
        >
          <DrawerHeader title="タイトル" />
          <DrawerBody>
            <p>content</p>
          </DrawerBody>
        </Drawer>
      </>
    )
  }

  const getOverlay = () => document.querySelector('.smarthr-ui-Drawer-overlay') as HTMLElement

  it('閉じ始めたあとのオーバーレイクリックで onClickOverlay を呼ばないこと', async () => {
    const onClickOverlay = vi.fn()
    const onClickClose = vi.fn()
    renderWithIntl(<ClosingTemplate onClickClose={onClickClose} onClickOverlay={onClickOverlay} />)

    await userEvent.click(getOverlay())
    expect(onClickOverlay).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: '外から閉じる' }))
    await userEvent.click(getOverlay())

    expect(onClickOverlay).toHaveBeenCalledTimes(1)
  })

  it('閉じ始めたあとの × クリックで onClickClose を呼ばないこと', async () => {
    const onClickOverlay = vi.fn()
    const onClickClose = vi.fn()
    renderWithIntl(<ClosingTemplate onClickClose={onClickClose} onClickOverlay={onClickOverlay} />)

    await userEvent.click(screen.getByRole('button', { name: '外から閉じる' }))
    await userEvent.click(screen.getByRole('button', { name: '閉じる' }))

    expect(onClickClose).not.toHaveBeenCalled()
  })
})

// ariaLabel / ariaLabelledby を省略したときの自動ラベル付けは、DrawerHeader が
// 実際に見出しを描画している場合にだけ成立する。ヘッダ無し・ラベル無しで
// aria-labelledby を付けると参照先が存在せず、アクセシブル名が空になる。
describe('Drawer（自動ラベル付け）', () => {
  it('DrawerHeader があれば見出しがアクセシブル名になること', () => {
    renderWithIntl(
      <Drawer isOpen position="right">
        <DrawerHeader title="ドロワータイトル" />
        <DrawerBody>
          <p>content</p>
        </DrawerBody>
      </Drawer>,
    )

    expect(screen.getByRole('dialog', { name: 'ドロワータイトル' })).toBeVisible()
  })

  it('DrawerHeader に id を渡してもその id が参照されること', () => {
    renderWithIntl(
      <Drawer isOpen position="right">
        <DrawerHeader id="custom-heading" title="独自 id の見出し" />
        <DrawerBody>
          <p>content</p>
        </DrawerBody>
      </Drawer>,
    )

    const dialog = screen.getByRole('dialog', { name: '独自 id の見出し' })
    expect(dialog).toHaveAttribute('aria-labelledby', 'custom-heading')
  })

  it('DrawerHeader もラベルも無ければ aria-labelledby を付けないこと', () => {
    renderWithIntl(
      <Drawer isOpen position="right">
        <DrawerBody>
          <p>content</p>
        </DrawerBody>
      </Drawer>,
    )

    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby')
  })
})
