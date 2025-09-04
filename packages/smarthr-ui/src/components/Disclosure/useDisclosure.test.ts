import { act, renderHook, waitFor } from '@testing-library/react'

import { useDisclosure } from './useDisclosure'

describe('useDisclosure', () => {
  test('同じidで呼ばれたhookがすべて同期する', async () => {
    const c1 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c2 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c3 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c4 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })
    const c5 = renderHook(useDisclosure, { initialProps: 'disclosure-1' })

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
  })
})
