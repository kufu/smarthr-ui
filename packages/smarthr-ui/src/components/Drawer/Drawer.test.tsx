import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useRef, useState } from 'react'

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

const renderWithIntl = (ui: React.ReactElement) =>
  render(<IntlProvider locale="ja">{ui}</IntlProvider>)

const ControlledTemplate: FC<{ position?: 'right' | 'left' | 'bottom' | 'top' }> = ({
  position,
}) => {
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

describe('Drawer ドラッグハンドル（縦方向）', () => {
  const VerticalTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>open</Button>
        <Drawer
          isOpen={isOpen}
          position="bottom"
          snapPoints={[0.3, 0.6, 1]}
          ariaLabel="ボトムドロワー"
          onClickClose={() => setIsOpen(false)}
        >
          <p>bottom content</p>
        </Drawer>
      </>
    )
  }

  it('縦方向では grabber（ハンドル）が表示され、適切な aria を持つこと', async () => {
    renderWithIntl(<VerticalTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))

    const handle = screen.getByRole('button', { name: 'ドロワーの大きさ' })
    expect(handle).toBeVisible()
    expect(handle).toHaveAttribute('aria-roledescription', 'ドラッグ可能')
  })

  it('横方向（right）では grabber を表示しないこと', async () => {
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
    expect(screen.queryByRole('button', { name: 'ドロワーの大きさ' })).toBeNull()
  })

  it('grabber の矢印キーでスナップ段階を移動できること（クラッシュしない）', async () => {
    renderWithIntl(<VerticalTemplate />)
    await userEvent.click(screen.getByRole('button', { name: 'open' }))
    const handle = screen.getByRole('button', { name: 'ドロワーの大きさ' })
    handle.focus()
    await userEvent.keyboard('{ArrowUp}')
    await userEvent.keyboard('{ArrowDown}')
    // 操作後も dialog が開いたまま（矢印キーで閉じない）
    expect(screen.getByRole('dialog', { name: 'ボトムドロワー' })).toBeVisible()
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
          variant="modeless"
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

  it('開いても背後のトリガからフォーカスを奪わないこと（FocusTrap しない）', async () => {
    renderWithIntl(<ModelessTemplate />)
    const trigger = screen.getByRole('button', { name: 'open' })
    await userEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'モードレスドロワー' })
    expect(document.activeElement).toBe(trigger)
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

  it('modeless でも onPressEscape を渡せば Escape で閉じること', async () => {
    const TemplateWithEscape: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setIsOpen(true)}>open</Button>
          <Drawer
            isOpen={isOpen}
            variant="modeless"
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
            variant="modeless"
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
            variant="modeless"
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
