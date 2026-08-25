import { act, renderHook } from '@testing-library/react'

import { TRIGGER_EVENT, useRemoteTrigger } from './useRemoteTrigger'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

const dispatchTriggerEvent = (id: string) => {
  document.dispatchEvent(new CustomEvent(TRIGGER_EVENT, { detail: { id } }))
}

describe('useRemoteTrigger', () => {
  test('TRIGGER_EVENTを受け取るとisOpenは同期的にtrueになる', () => {
    const { result } = renderHook(() => useRemoteTrigger({ id: 'test' }))

    act(() => {
      dispatchTriggerEvent('test')
    })

    expect(result.current.isOpen).toBe(true)
  })

  test('onOpen・onToggleは同期的には呼ばれず、次のアニメーションフレームで呼ばれる', async () => {
    const onOpen = vi.fn()
    const onToggle = vi.fn()
    renderHook(() => useRemoteTrigger({ id: 'test', onOpen, onToggle }))

    act(() => {
      dispatchTriggerEvent('test')
    })

    // HINT: 状態更新の反映を待つ利用者側の処理と競合しないよう、次のフレームまでは呼ばれない
    expect(onOpen).not.toHaveBeenCalled()
    expect(onToggle).not.toHaveBeenCalled()

    await waitForAnimationFrame()

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledExactlyOnceWith(true)
  })

  test('同一フレーム内で連続してトグルすると、最後の状態のみ通知される', async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const onToggle = vi.fn()
    const { result } = renderHook(() => useRemoteTrigger({ id: 'test', onOpen, onClose, onToggle }))

    act(() => {
      dispatchTriggerEvent('test')
      result.current.handleClickClose()
    })

    await waitForAnimationFrame()

    // HINT: open用に予約されたフレームはclose時にcancelされるため、onOpenは呼ばれない
    expect(onOpen).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledExactlyOnceWith(false)
  })

  test('アンマウント後は保留中のコールバックが呼ばれない', async () => {
    const onOpen = vi.fn()
    const onToggle = vi.fn()
    const { unmount } = renderHook(() => useRemoteTrigger({ id: 'test', onOpen, onToggle }))

    act(() => {
      dispatchTriggerEvent('test')
    })
    unmount()

    await waitForAnimationFrame()

    expect(onOpen).not.toHaveBeenCalled()
    expect(onToggle).not.toHaveBeenCalled()
  })

  test('onClickCloseが指定されている場合、close処理を呼び出すまでisOpenはtrueのまま', () => {
    const onClickClose = vi.fn()
    const { result } = renderHook(() => useRemoteTrigger({ id: 'test', onClickClose }))

    act(() => {
      dispatchTriggerEvent('test')
    })

    act(() => {
      result.current.handleClickClose()
    })

    expect(onClickClose).toHaveBeenCalledTimes(1)
    expect(result.current.isOpen).toBe(true)

    act(() => {
      onClickClose.mock.calls[0][0]()
    })

    expect(result.current.isOpen).toBe(false)
  })
})
