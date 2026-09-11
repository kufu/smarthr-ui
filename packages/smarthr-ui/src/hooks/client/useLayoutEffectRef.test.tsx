import { render } from '@testing-library/react'
import { useCallback } from 'react'

import { useLayoutEffectRef } from './useLayoutEffectRef'
import { useMergeRefs } from './useMergeRefs'

describe('useLayoutEffectRef', () => {
  test('mount時にnodeを引数にactionが1回だけ呼ばれる', () => {
    const action = vi.fn()
    const Component = () => {
      const ref = useLayoutEffectRef(action, [])
      return <div ref={ref} />
    }

    render(<Component />)

    expect(action).toHaveBeenCalledTimes(1)
    expect(action.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement)
  })

  test('dependenciesが変化するとactionが再実行される(nodeは変わらない)', () => {
    const action = vi.fn()
    const Component = ({ dep }: { dep: number }) => {
      const ref = useLayoutEffectRef(action, [dep])
      return <div ref={ref} />
    }

    const { rerender } = render(<Component dep={1} />)
    expect(action).toHaveBeenCalledTimes(1)
    const firstNode = action.mock.calls[0][0]

    rerender(<Component dep={1} />)
    expect(action).toHaveBeenCalledTimes(1)

    rerender(<Component dep={2} />)
    expect(action).toHaveBeenCalledTimes(2)
    expect(action.mock.calls[1][0]).toBe(firstNode)
  })

  test('dependenciesが変わらなくても、node自体が差し替わるとactionが再実行される', () => {
    const action = vi.fn()
    const Component = ({ id }: { id: string }) => {
      const ref = useLayoutEffectRef(action, [])
      return <div key={id} ref={ref} />
    }

    const { rerender } = render(<Component id="first" />)
    expect(action).toHaveBeenCalledTimes(1)

    rerender(<Component id="second" />)
    expect(action).toHaveBeenCalledTimes(3)
    expect(action.mock.calls[1][0]).toBeNull()
    expect(action.mock.calls[2][0]).toBeInstanceOf(HTMLDivElement)
  })

  test('cleanup関数が再実行前とアンマウント時に呼ばれる', () => {
    const cleanup = vi.fn()
    const action = vi.fn(() => cleanup)
    const Component = ({ dep }: { dep: number }) => {
      const ref = useLayoutEffectRef(action, [dep])
      return <div ref={ref} />
    }

    const { rerender, unmount } = render(<Component dep={1} />)
    expect(cleanup).toHaveBeenCalledTimes(0)

    rerender(<Component dep={2} />)
    expect(cleanup).toHaveBeenCalledTimes(1)

    unmount()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })

  test('actionがcleanupを返さない場合もエラーにならない', () => {
    const action = vi.fn(() => undefined)
    const Component = ({ dep }: { dep: number }) => {
      const ref = useLayoutEffectRef(action, [dep])
      return <div ref={ref} />
    }

    const { rerender, unmount } = render(<Component dep={1} />)

    expect(() => rerender(<Component dep={2} />)).not.toThrow()
    expect(() => unmount()).not.toThrow()
  })

  test('依存配列が変化しない場合、propsが変わってもactionは再実行されない', () => {
    const results: string[] = []
    const Component = ({ label }: { label: string }) => {
      const ref = useLayoutEffectRef(() => {
        results.push(label)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return <div ref={ref} />
    }

    const { rerender } = render(<Component label="first" />)
    rerender(<Component label="second" />)

    expect(results).toEqual(['first'])
  })

  test('useMergeRefsに渡しても他のref(安定化済み)が巻き込まれない', () => {
    const otherRefCalls: Array<HTMLElement | null> = []
    const Component = ({ dep }: { dep: number }) => {
      const layoutRef = useLayoutEffectRef(() => {}, [dep])
      const otherRef = useCallback((node: HTMLElement | null) => {
        otherRefCalls.push(node)
      }, [])
      const merged = useMergeRefs(layoutRef, otherRef)
      return <div ref={merged} />
    }

    const { rerender } = render(<Component dep={1} />)
    expect(otherRefCalls.length).toBe(1)

    rerender(<Component dep={2} />)
    expect(otherRefCalls.length).toBe(1)
  })

  test('一度もmountされない(nodeがtruthyにならない)まま条件が変化してもactionは呼ばれない', () => {
    const action = vi.fn()
    const Component = ({ show, dep }: { show: boolean; dep: number }) => {
      const ref = useLayoutEffectRef(action, [dep])
      return show ? <div ref={ref} /> : null
    }

    const { rerender, unmount } = render(<Component show={false} dep={1} />)
    rerender(<Component show={false} dep={2} />)
    expect(action).toHaveBeenCalledTimes(0)

    unmount()
    expect(action).toHaveBeenCalledTimes(0)
  })

  test('mountされていない状態を経てからmountされた場合、actionは1回だけ呼ばれる', () => {
    const action = vi.fn()
    const Component = ({ show, dep }: { show: boolean; dep: number }) => {
      const ref = useLayoutEffectRef(action, [dep])
      return show ? <div ref={ref} /> : null
    }

    const { rerender } = render(<Component show={false} dep={1} />)
    rerender(<Component show={false} dep={2} />)
    // showとdepが同時に変化するケース
    rerender(<Component show={true} dep={3} />)

    expect(action).toHaveBeenCalledTimes(1)
  })

  describe('useLayoutEffectRefを利用するコンポーネントと、それを埋め込む側のコンポーネントが異なる場合', () => {
    test('埋め込み側がunmount/再mountすると、それぞれ正しくaction/cleanupが呼ばれる', () => {
      const cleanups: Array<() => void> = []
      const action = vi.fn((node: HTMLElement | null) => {
        if (!node) return undefined
        const cleanup = vi.fn()
        cleanups.push(cleanup)
        return cleanup
      })
      const Inner = () => {
        const ref = useLayoutEffectRef(action, [])
        return <div ref={ref} />
      }
      const Outer = ({ show }: { show: boolean }) => (show ? <Inner /> : null)

      const { rerender } = render(<Outer show={true} />)
      expect(action).toHaveBeenCalledTimes(1)
      expect(action.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement)

      // unmount: Innerコンポーネント自体が破棄される
      rerender(<Outer show={false} />)
      expect(action).toHaveBeenCalledTimes(2)
      expect(action.mock.calls[1][0]).toBeNull()
      expect(cleanups[0]).toHaveBeenCalledTimes(1)

      // 再mount: Innerコンポーネントが新しいインスタンスとして生成される
      rerender(<Outer show={true} />)
      expect(action).toHaveBeenCalledTimes(3)
      expect(action.mock.calls[2][0]).toBeInstanceOf(HTMLDivElement)
      expect(action.mock.calls[2][0]).not.toBe(action.mock.calls[0][0])

      // 再度unmount
      rerender(<Outer show={false} />)
      expect(action).toHaveBeenCalledTimes(4)
      expect(action.mock.calls[3][0]).toBeNull()
      expect(cleanups[1]).toHaveBeenCalledTimes(1)
    })

    test('unmount/再mountを繰り返した後も、dependencies変化によるaction呼び出しは正常', () => {
      const action = vi.fn()
      const Inner = ({ dep }: { dep: number }) => {
        const ref = useLayoutEffectRef(action, [dep])
        return <div ref={ref} />
      }
      const Outer = ({ show, dep }: { show: boolean; dep: number }) =>
        show ? <Inner dep={dep} /> : null

      const { rerender } = render(<Outer show={true} dep={1} />)
      expect(action).toHaveBeenCalledTimes(1)

      rerender(<Outer show={false} dep={1} />)
      expect(action).toHaveBeenCalledTimes(2) // unmountでnull呼び出し

      rerender(<Outer show={true} dep={1} />)
      expect(action).toHaveBeenCalledTimes(3) // 再mount

      // 再mount後、内部stateは新しいインスタンスとして初期化されているため、
      // dependencies変化による再実行が正しく機能するか確認する
      rerender(<Outer show={true} dep={2} />)
      expect(action).toHaveBeenCalledTimes(4)
    })

    test('埋め込み側だけでなく利用側(Outer)自体がunmount/再mountしても、正しくaction/cleanupが呼ばれる', () => {
      const cleanups: Array<() => void> = []
      const action = vi.fn((node: HTMLElement | null) => {
        if (!node) return undefined
        const cleanup = vi.fn()
        cleanups.push(cleanup)
        return cleanup
      })
      const Inner = () => {
        const ref = useLayoutEffectRef(action, [])
        return <div ref={ref} />
      }
      const Outer = () => <Inner />
      const Root = ({ show }: { show: boolean }) => (show ? <Outer /> : null)

      const { rerender } = render(<Root show={true} />)
      expect(action).toHaveBeenCalledTimes(1)
      expect(action.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement)

      // unmount: OuterごとInnerコンポーネントも破棄される
      rerender(<Root show={false} />)
      expect(action).toHaveBeenCalledTimes(2)
      expect(action.mock.calls[1][0]).toBeNull()
      expect(cleanups[0]).toHaveBeenCalledTimes(1)

      // 再mount: OuterごとInnerコンポーネントも新しいインスタンスとして生成される
      rerender(<Root show={true} />)
      expect(action).toHaveBeenCalledTimes(3)
      expect(action.mock.calls[2][0]).toBeInstanceOf(HTMLDivElement)
      expect(action.mock.calls[2][0]).not.toBe(action.mock.calls[0][0])

      // 再度unmount
      rerender(<Root show={false} />)
      expect(action).toHaveBeenCalledTimes(4)
      expect(action.mock.calls[3][0]).toBeNull()
      expect(cleanups[1]).toHaveBeenCalledTimes(1)
    })
  })
})
