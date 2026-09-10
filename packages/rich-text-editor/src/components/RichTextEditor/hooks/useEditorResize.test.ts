import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useEditorResize } from './useEditorResize'

import type { PointerEvent as ReactPointerEvent } from 'react'

const appended: HTMLElement[] = []

afterEach(() => {
  appended.splice(0).forEach((el) => el.remove())
})

/**
 * .ProseMirror の実測値と CSS 上の下限を固定するための土台を作る。
 * getComputedStyle が値を返すよう document に繋ぐ必要がある。
 */
const setupContent = (initialHeight: number, minHeight = '0px') => {
  const content = document.createElement('div')
  const proseMirror = document.createElement('div')
  proseMirror.className = 'ProseMirror'
  proseMirror.style.minHeight = minHeight
  proseMirror.getBoundingClientRect = () => ({ height: initialHeight }) as unknown as DOMRect
  content.appendChild(proseMirror)
  document.body.appendChild(content)
  appended.push(content)

  return { current: content }
}

const pointerDownEvent = (clientY: number) =>
  ({ clientY, preventDefault: () => {} }) as unknown as ReactPointerEvent

describe('useEditorResize', () => {
  it('ドラッグしていなければ draggedHeight は null', () => {
    const contentRef = setupContent(200)
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    expect(result.current.draggedHeight).toBeNull()
  })

  it('下方向のドラッグ量が開始時の高さに加算される', () => {
    const contentRef = setupContent(200)
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 150 }))
    })

    expect(result.current.draggedHeight).toBe(250)
  })

  it('上方向のドラッグ量が開始時の高さから減算される', () => {
    const contentRef = setupContent(200)
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 60 }))
    })

    expect(result.current.draggedHeight).toBe(160)
  })

  it('pointerup 後の pointermove は高さを変えない', () => {
    const contentRef = setupContent(200)
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 150 }))
    })
    act(() => {
      window.dispatchEvent(new MouseEvent('pointerup', {}))
    })
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 400 }))
    })

    expect(result.current.draggedHeight).toBe(250)
  })

  it('enabled が false のときドラッグを受け付けない', () => {
    const contentRef = setupContent(200)
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: false }))

    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 150 }))
    })

    expect(result.current.draggedHeight).toBeNull()
  })

  it('CSS の min-height を下回る高さにはならない', () => {
    const contentRef = setupContent(200, '128px')
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: -300 }))
    })

    expect(result.current.draggedHeight).toBe(128)
  })

  it('下限まで縮めた後に伸ばすと、下限を起点として追従する', () => {
    const contentRef = setupContent(200, '128px')
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    // 下限を大きく下回るまで縮める
    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: -300 }))
    })
    act(() => {
      window.dispatchEvent(new MouseEvent('pointerup', {}))
    })

    // 次のドラッグは下限(128)を起点にするため、+50 で 178 になる
    act(() => result.current.handlePointerDown(pointerDownEvent(0)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 50 }))
    })

    expect(result.current.draggedHeight).toBe(178)
  })

  it('2回目のドラッグは1回目の結果を起点にする', () => {
    const contentRef = setupContent(200)
    const { result } = renderHook(() => useEditorResize({ contentRef, enabled: true }))

    act(() => result.current.handlePointerDown(pointerDownEvent(100)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 150 }))
    })
    act(() => {
      window.dispatchEvent(new MouseEvent('pointerup', {}))
    })

    act(() => result.current.handlePointerDown(pointerDownEvent(0)))
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientY: 30 }))
    })

    expect(result.current.draggedHeight).toBe(280)
  })
})
