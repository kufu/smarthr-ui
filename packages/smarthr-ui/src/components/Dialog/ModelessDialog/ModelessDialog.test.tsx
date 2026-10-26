import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { ModelessDialog } from './ModelessDialog'

describe('ModelessDialog', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ModelessDialog</Button>
        <ModelessDialog
          isOpen={isOpen}
          onClickClose={() => setIsOpen(false)}
          heading="座標指定表示"
        >
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    // トリガ押下でダイアログが開くこと
    expect(screen.queryByRole('dialog', { name: 'ModelessDialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: '座標指定表示' })).toBeVisible()

    // 裏側をクリックしてもダイアログが閉じないこと
    await userEvent.click(document.body)
    await waitFor(
      () => {
        expect(screen.getByRole('dialog', { name: '座標指定表示' })).toBeVisible()
      },
      { timeout: 1000 },
    )

    // 閉じるボタン押下でダイアログが閉じること
    await act(() => screen.getByRole('button', { name: '閉じる' }).click())
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: '座標指定表示' })).toBeNull()
      },
      { timeout: 1000 },
    )
  })

  it('閉じるボタンのクリックでonClickCloseに実際のMouseEventが渡されること', async () => {
    const handleClickClose = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ModelessDialog isOpen onClickClose={handleClickClose} heading="座標指定表示">
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </IntlProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: '閉じる' }))

    expect(handleClickClose).toHaveBeenCalledTimes(1)
    expect(handleClickClose.mock.calls[0][0].nativeEvent).toBeInstanceOf(MouseEvent)
  })

  it('Escapeキー押下でonPressEscapeに実際のKeyboardEventが渡されること', async () => {
    const handlePressEscape = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ModelessDialog
          isOpen
          onClickClose={() => {}}
          onPressEscape={handlePressEscape}
          heading="座標指定表示"
        >
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </IntlProvider>,
    )

    await userEvent.keyboard('{Escape}')

    expect(handlePressEscape).toHaveBeenCalledTimes(1)
    const receivedEvent = handlePressEscape.mock.calls[0][0]
    expect(receivedEvent).toBeInstanceOf(KeyboardEvent)
    expect(receivedEvent.key).toBe('Escape')
  })

  it('初回マウント時にisOpenがtrueの場合も、正しく中央寄せされること', () => {
    // HINT: jsdomにはレイアウトが無いため、DOMに接続済みの要素にのみサイズを持たせてrectを返す。
    // portal containerがdocument.bodyへappendされる前に計測すると0が返り、中央寄せがずれる不具合の再現に使う
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const size = this.isConnected ? { width: 200, height: 100 } : { width: 0, height: 0 }
      return { ...size, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => {} }
    })

    render(
      <IntlProvider locale="ja">
        <ModelessDialog isOpen onClickClose={() => {}} heading="初回マウント表示">
          <p>ダイアログの中身</p>
        </ModelessDialog>
      </IntlProvider>,
    )

    const dialog = screen.getByRole('dialog', { name: '初回マウント表示' })

    expect(dialog.style.top).toBe(`${window.innerHeight / 2 - 50}px`)
    expect(dialog.style.left).toBe(`${window.innerWidth / 2 - 100}px`)
  })

  it('画面の上端より上へはドラッグできないこと', async () => {
    // HINT: jsdomにはレイアウトが無いため、style.topとドラッグ量から画面上の位置を算出して返す。
    // ドラッグ量はreact-draggableがtransformのtranslateとして書き込む
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const translateY = Number(
        this.style.transform.match(/translate\([^,]+,\s*(-?[\d.]+)px\)/)?.[1] ?? 0,
      )
      const top = (parseFloat(this.style.top) || 0) + translateY

      return {
        width: 0,
        height: 0,
        top,
        left: 0,
        right: 0,
        bottom: top,
        x: 0,
        y: 0,
        toJSON: () => {},
      }
    })

    const dragVertically = (deltaY: number) => {
      fireEvent.mouseDown(screen.getByRole('button', { name: 'ダイアログの位置' }), {
        clientX: 0,
        clientY: 500,
      })
      fireEvent.mouseMove(document, { clientX: 0, clientY: 500 + deltaY })
      fireEvent.mouseUp(document, { clientX: 0, clientY: 500 + deltaY })
    }

    // HINT: 初回描画時と開くときで異なるtopを渡す(位置を開くたびに算出する利用側を想定)
    const Template: FC = () => {
      const [isOpen, setIsOpen] = useState(false)
      const [top, setTop] = useState(32)

      return (
        <IntlProvider locale="ja">
          <Button
            onClick={() => {
              setTop(100)
              setIsOpen(true)
            }}
          >
            開く
          </Button>
          <ModelessDialog
            isOpen={isOpen}
            top={top}
            left={100}
            onClickClose={() => setIsOpen(false)}
            heading="位置指定"
          >
            <p>ダイアログの中身</p>
          </ModelessDialog>
        </IntlProvider>
      )
    }

    render(<Template />)

    await userEvent.click(screen.getByRole('button', { name: '開く' }))
    const dialog = screen.getByRole('dialog', { name: '位置指定' })
    expect(dialog.style.top).toBe('100px')

    // 下へ動かしたあとに上へ動かしても、画面の上端で止まること
    dragVertically(200)
    dragVertically(-500)
    expect(dialog.getBoundingClientRect().top).toBe(0)

    await act(() => screen.getByRole('button', { name: '閉じる' }).click())
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: '位置指定' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // 開き直したあとも、画面の上端で止まること
    await userEvent.click(screen.getByRole('button', { name: '開く' }))
    dragVertically(-500)
    expect(screen.getByRole('dialog', { name: '位置指定' }).getBoundingClientRect().top).toBe(0)
  })
})
