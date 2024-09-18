import { renderHook } from '@testing-library/react'

import { useId } from './useId'

describe('useId', () => {
  it('defaultId を指定した場合、毎回同じ値を返す', () => {
    const { result: id1 } = renderHook(() => useId('test'))
    const { result: id2 } = renderHook(() => useId('test'))
    const { result: id3 } = renderHook(() => useId('test'))

    expect(id1.current).toEqual('test')
    expect(id2.current).toEqual('test')
    expect(id3.current).toEqual('test')
  })

  it('defaultId を指定しない場合、異なる値を返す', () => {
    const { result: id1 } = renderHook(() => useId())
    const { result: id2 } = renderHook(() => useId())
    const { result: id3 } = renderHook(() => useId())

    expect(id1.current).not.toEqual(id2.current)
    expect(id2.current).not.toEqual(id3.current)
    expect(id3.current).not.toEqual(id1.current)
  })
})
