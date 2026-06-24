import { act, renderHook } from '@testing-library/react'
import { type ReactNode, createRef } from 'react'
import { IntlProvider } from 'react-intl'
import { vi } from 'vitest'

import { useListbox } from '../useListbox'

const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

describe('useListbox - activeOption', () => {
  const initialProps = {
    options: [
      { id: 'id1', selected: false, isNew: false, item: { label: 'label1', value: 'value1' } },
      { id: 'id2', selected: false, isNew: false, item: { label: 'label2', value: 'value2' } },
      {
        id: 'id3',
        selected: false,
        isNew: false,
        item: { label: 'label3', value: 'value3', disabled: true },
      },
      { id: 'id4', selected: false, isNew: false, item: { label: 'label4', value: 'value4' } },
    ],
    onSelect: () => {},
    isExpanded: false,
    triggerRef: createRef<HTMLElement>(),
  }

  type RenderHookResult = ReturnType<
    typeof renderHook<ReturnType<typeof useListbox>, typeof initialProps>
  >

  let result: RenderHookResult['result']
  let rerender: RenderHookResult['rerender']
  beforeEach(() => {
    const renderHookResult = renderHook((props) => useListbox(props), { initialProps, wrapper })
    result = renderHookResult.result
    rerender = renderHookResult.rerender
  })

  it('options が変更されても activeOption が維持されること', () => {
    // キーボードイベントで activeOption を設定
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
      event.stopPropagation = vi.fn()
      result.current.onKeyDownListBox(event)
    })
    expect(result.current.activeOption).toEqual(initialProps.options[0])

    rerender({
      ...initialProps,
      options: [
        ...initialProps.options,
        { id: 'id5', selected: false, isNew: false, item: { label: 'label5', value: 'value5' } },
      ],
    })
    expect(result.current.activeOption).toEqual(initialProps.options[0])
  })

  it('options から activeOption と一致する option が消えたとき、activeOption がリセットされること', () => {
    // キーボードイベントで activeOption を設定
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
      event.stopPropagation = vi.fn()
      result.current.onKeyDownListBox(event)
    })
    expect(result.current.activeOption).toEqual(initialProps.options[0])

    rerender({
      ...initialProps,
      options: initialProps.options.slice(1),
    })
    expect(result.current.activeOption).toBeNull()
  })

  describe('moveActiveOptionIndex via ArrowDown', () => {
    it('activeOption が未設定のとき、最初に先頭のアイテムが選択されること', () => {
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[0])
    })

    it('disabled な option が飛ばされること', () => {
      // id2 を選択
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[1])

      // 次は id3 (disabled) をスキップして id4 になる
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[3])
    })

    it('末尾の option から 先頭の option にループすること', () => {
      // 末尾まで移動
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[3])

      // さらに下矢印で先頭にループ
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[0])
    })
  })

  describe('moveActiveOptionIndex via ArrowUp', () => {
    it('activeOption が未設定のとき、末尾のアイテムが選択されること', () => {
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[3])
    })

    it('activeOption を変更できること', () => {
      expect(result.current.activeOption).toBeNull()

      // 上矢印で末尾から
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[3])

      // 2回上矢印（id3はdisabledなのでスキップされてid2へ）
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[1])

      // さらに上矢印でid1へ
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[0])

      // さらに上矢印で末尾にループ
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' }) as any
        event.stopPropagation = vi.fn()
        result.current.onKeyDownListBox(event)
      })
      expect(result.current.activeOption).toEqual(initialProps.options[3])
    })
  })
})
