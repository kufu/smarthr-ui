import { act, renderHook, waitFor } from '@testing-library/react'

import { useDisclosure } from './useDisclosure'

describe('useDisclosure', () => {
  test('同じidで呼ばれたhookがすべて同期する', async () => {
    const c1 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c2 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c3 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c4 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c5 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })

    let cleanups: Array<() => void> = []

    act(() => {
      cleanups = [c1, c2, c3, c4, c5].map((c) => c.result.current[2]())
    })

    try {
      expect(c1.result.current[0]).toBe(false)
      expect(c2.result.current[0]).toBe(false)
      expect(c3.result.current[0]).toBe(false)
      expect(c4.result.current[0]).toBe(false)
      expect(c5.result.current[0]).toBe(false)

      act(() => {
        c3.result.current[1](true)
      })

      await waitFor(() => {
        expect(c1.result.current[0]).toBe(true)
        expect(c2.result.current[0]).toBe(true)
        expect(c3.result.current[0]).toBe(true)
        expect(c4.result.current[0]).toBe(true)
        expect(c5.result.current[0]).toBe(true)
      })

      act(() => {
        c3.result.current[1](false)
      })

      await waitFor(() => {
        expect(c1.result.current[0]).toBe(false)
        expect(c2.result.current[0]).toBe(false)
        expect(c3.result.current[0]).toBe(false)
        expect(c4.result.current[0]).toBe(false)
        expect(c5.result.current[0]).toBe(false)
      })
    } finally {
      act(() => {
        cleanups.forEach((cleanup) => cleanup())
      })
    }
  })

  test('initialExpanded を渡すと、animation frame を待たずに初期値として反映される', () => {
    const { result } = renderHook(() => useDisclosure('disclosure-2', true))

    expect(result.current[0]).toBe(true)
  })

  test('notifyDisclosureChange で現在の開閉状態が同じidのhookに同期される', async () => {
    const opened = renderHook(() => useDisclosure('disclosure-3', true))
    const other = renderHook(() => useDisclosure('disclosure-3'))

    let cleanups: Array<() => void> = []

    act(() => {
      cleanups = [opened, other].map((c) => c.result.current[2]())
    })

    try {
      expect(other.result.current[0]).toBe(false)

      act(() => {
        opened.result.current[3]()
      })

      await waitFor(() => {
        expect(other.result.current[0]).toBe(true)
      })
    } finally {
      act(() => {
        cleanups.forEach((cleanup) => cleanup())
      })
    }
  })
})
