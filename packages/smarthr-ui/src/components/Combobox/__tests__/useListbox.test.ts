import { act, renderHook } from '@testing-library/react'
import { createRef } from 'react'
import { vi } from 'vitest'

import { useListbox } from '../useListbox'

describe('useListbox', () => {
  const options = [
    { id: 'id1', selected: false, isNew: false, item: { label: 'label1', value: 'value1' } },
    { id: 'id2', selected: false, isNew: false, item: { label: 'label2', value: 'value2' } },
    {
      id: 'id3',
      selected: false,
      isNew: false,
      item: { label: 'label3', value: 'value3', disabled: true },
    },
    { id: 'id4', selected: false, isNew: false, item: { label: 'label3', value: 'value3' } },
  ]

  const triggerRef = createRef<HTMLElement>()

  const initialProps = {
    options,
    onSelect: vi.fn(),
    isExpanded: true,
    triggerRef,
  }

  type RenderHookResult = ReturnType<
    typeof renderHook<ReturnType<typeof useListbox>, typeof initialProps>
  >

  let result: RenderHookResult['result']
  let rerender: RenderHookResult['rerender']

  beforeEach(() => {
    const renderHookResult = renderHook((props) => useListbox(props), { initialProps })
    result = renderHookResult.result
    rerender = renderHookResult.rerender
  })

  const mockKeyEvent = (key: string) => ({ key, stopPropagation: vi.fn() }) as any

  it('options が変更されても activeOption が維持されること', () => {
    act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowDown')))
    expect(result.current.activeOption).toEqual(options[0])
    rerender({
      ...initialProps,
      options: [
        ...options,
        { id: 'id5', selected: false, isNew: false, item: { label: 'label4', value: 'value4' } },
      ],
    })
    expect(result.current.activeOption).toEqual(options[0])
  })

  it('options から activeOption と一致する option が消えたとき、activeOption がリセットされること', () => {
    act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowDown')))
    expect(result.current.activeOption).toEqual(options[0])
    rerender({
      ...initialProps,
      options: options.slice(1),
    })
    expect(result.current.activeOption).toBeNull()
  })

  it('handleHoverOption で activeOption をセットできること', () => {
    act(() => result.current.listBoxProps.handleHoverOption(options[2]))
    expect(result.current.activeOption).toEqual(options[2])
  })

  describe('ArrowDown キーで moveActiveOptionIndex(+1)', () => {
    it('activeOption が未設定のとき、最初に先頭のアイテムが選択されること', () => {
      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowDown')))
      expect(result.current.activeOption).toEqual(options[0])
    })

    it('disabled な option が飛ばされること', () => {
      act(() => result.current.listBoxProps.handleHoverOption(options[1]))
      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowDown')))
      expect(result.current.activeOption).toEqual(options[3])
    })

    it('末尾の option から先頭の option にループすること', () => {
      act(() => result.current.listBoxProps.handleHoverOption(options[options.length - 1]))
      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowDown')))
      expect(result.current.activeOption).toEqual(options[0])
    })
  })

  describe('ArrowUp キーで moveActiveOptionIndex(-1)', () => {
    it('activeOption を変更できること', () => {
      expect(result.current.activeOption).toBeNull()

      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowUp')))
      expect(result.current.activeOption).toEqual(options[3])

      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowUp')))
      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowUp')))
      expect(result.current.activeOption).toEqual(options[0])

      act(() => result.current.handleKeyDownListBox(mockKeyEvent('ArrowUp')))
      expect(result.current.activeOption).toEqual(options[3])
    })
  })
})
