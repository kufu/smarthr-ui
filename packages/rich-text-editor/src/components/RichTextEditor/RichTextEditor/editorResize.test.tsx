import { act, render, waitFor } from '@testing-library/react'
import { IntlProvider } from 'smarthr-ui'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor'

import type { ReactNode } from 'react'

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

afterEach(() => {
  vi.restoreAllMocks()
})

/**
 * 本文の実測値と CSS 上の下限を固定する。jsdom はレイアウトを持たず、Tailwind も読み込まないため。
 */
const renderResizable = async (initialHeight: number, minHeight = '0px') => {
  const { container, rerender } = render(<RichTextEditor features={['bold']} resizable />, {
    wrapper: Wrapper,
  })
  await waitFor(() => expect(container.querySelector('.ProseMirror')).not.toBeNull())

  const proseMirror = container.querySelector<HTMLElement>('.ProseMirror')!
  proseMirror.style.minHeight = minHeight
  proseMirror.getBoundingClientRect = () => ({ height: initialHeight }) as DOMRect

  const handle = container.querySelector<HTMLElement>('.smarthr-ui-RichTextEditor-resizeHandle')!

  // jsdom は PointerEvent を持たない。React は種別だけを見るので MouseEvent で足りる
  const pointer = (target: EventTarget, type: string, clientY = 0, button = 0) =>
    act(() => {
      target.dispatchEvent(
        new MouseEvent(type, { clientY, button, bubbles: true, cancelable: true }),
      )
    })

  const editorHeight = () => {
    const el = [...container.querySelectorAll<HTMLElement>('[style]')].find((node) =>
      node.style.getPropertyValue('--shr-rte-editor-height'),
    )
    return el?.style.getPropertyValue('--shr-rte-editor-height') ?? null
  }

  return {
    editorHeight,
    down: (clientY: number, button = 0) => pointer(handle, 'pointerdown', clientY, button),
    setReadOnly: () => rerender(<RichTextEditor readOnly features={['bold']} resizable />),
    move: (clientY: number) => pointer(window, 'pointermove', clientY),
    up: () => pointer(window, 'pointerup'),
  }
}

describe('高さのドラッグ', () => {
  it('ドラッグしていなければ高さを指定しない', async () => {
    const { editorHeight } = await renderResizable(200)

    expect(editorHeight()).toBeNull()
  })

  it('下方向のドラッグ量が開始時の高さに加算される', async () => {
    const { editorHeight, down, move } = await renderResizable(200)

    down(100)
    move(150)

    expect(editorHeight()).toBe('250px')
  })

  it('上方向のドラッグ量が開始時の高さから減算される', async () => {
    const { editorHeight, down, move } = await renderResizable(200)

    down(100)
    move(60)

    expect(editorHeight()).toBe('160px')
  })

  it('pointerup 後の pointermove は高さを変えない', async () => {
    const { editorHeight, down, move, up } = await renderResizable(200)

    down(100)
    move(150)
    up()
    move(400)

    expect(editorHeight()).toBe('250px')
  })

  it('CSS の min-height を下回る高さにはならない', async () => {
    const { editorHeight, down, move } = await renderResizable(200, '128px')

    down(100)
    move(-300)

    expect(editorHeight()).toBe('128px')
  })

  it('下限まで縮めた後に伸ばすと、下限を起点として追従する', async () => {
    const { editorHeight, down, move, up } = await renderResizable(200, '128px')

    down(100)
    move(-300)
    up()

    // 次のドラッグは下限(128)を起点にするため、+50 で 178 になる
    down(0)
    move(50)

    expect(editorHeight()).toBe('178px')
  })

  it('2回目のドラッグは1回目の結果を起点にする', async () => {
    const { editorHeight, down, move, up } = await renderResizable(200)

    down(100)
    move(150)
    up()

    down(0)
    move(30)

    expect(editorHeight()).toBe('280px')
  })

  // 右クリックはコンテキストメニューが開き、pointerup が届かないままドラッグが残ることがある
  it('左ボタン以外ではドラッグを始めない', async () => {
    const { editorHeight, down, move } = await renderResizable(200)

    down(100, 2)
    move(150)

    expect(editorHeight()).toBeNull()
  })

  it('ドラッグ中に readOnly へ切り替えると、それ以降の移動で高さが変わらない', async () => {
    const { editorHeight, down, move, setReadOnly } = await renderResizable(200)

    down(100)
    move(150)
    setReadOnly()
    move(300)

    expect(editorHeight()).toBe('250px')
  })

  it('リサイズできないエディタはポインタの移動を購読しない', async () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const { container } = render(<RichTextEditor features={['bold']} />, { wrapper: Wrapper })
    await waitFor(() => expect(container.querySelector('.ProseMirror')).not.toBeNull())

    expect(addEventListener.mock.calls.map(([type]) => type)).not.toContain('pointermove')
  })
})
