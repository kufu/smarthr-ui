import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('cancelを呼ぶと保留中の関数が実行されない', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 100)

    debouncedFunc()
    debouncedFunc.cancel()
    vi.advanceTimersByTime(100)

    expect(func).not.toHaveBeenCalled()
  })

  it('cancel後に再度呼び出すと関数が実行される', () => {
    const func = vi.fn()
    const debouncedFunc = debounce(func, 100)

    debouncedFunc()
    debouncedFunc.cancel()
    debouncedFunc()
    vi.advanceTimersByTime(100)

    expect(func).toHaveBeenCalledOnce()
  })
})
