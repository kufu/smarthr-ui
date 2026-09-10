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

  describe('calculateRect による横方向の位置の算出', () => {
    const VIEWPORT_WIDTH = 1000
    // theme.spacingByChar(0.5) 相当の、ビューポート右端に残す余白
    const VIEWPORT_MARGIN = 8

    const originalInnerWidth = window.innerWidth

    const setInnerWidth = (value: number) => {
      Object.defineProperty(window, 'innerWidth', {
        value,
        configurable: true,
        writable: true,
      })
    }

    afterEach(() => setInnerWidth(originalInnerWidth))

    const EMPTY_RECT = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => '',
    }

    const createRect = (rect: Partial<DOMRect>) => ({ ...EMPTY_RECT, ...rect }) as DOMRect

    // 入力欄とリストボックスの実測値を固定した状態で calculateRect を実行し、算出された left を返す
    const getCalculatedLeft = ({
      triggerLeft,
      triggerRight,
      listBoxWidth,
    }: {
      triggerLeft: number
      triggerRight: number
      listBoxWidth: number
    }) => {
      setInnerWidth(VIEWPORT_WIDTH)

      const trigger = document.createElement('div')
      trigger.getBoundingClientRect = () =>
        createRect({
          left: triggerLeft,
          right: triggerRight,
          width: triggerRight - triggerLeft,
          bottom: 30,
          height: 30,
        })

      const listBox = document.createElement('div')
      listBox.style.maxHeight = '300px'
      listBox.getBoundingClientRect = () => createRect({ width: listBoxWidth })

      const props = { ...initialProps, triggerRef: { current: trigger } }
      const renderHookResult = renderHook((p) => useListbox(p), { initialProps: props })

      // ListBox がレンダリングされた状態を再現し、実測値が得られる状態で再計算させる
      renderHookResult.result.current.listBoxRef.current = listBox
      renderHookResult.rerender({ ...props, options: [...options] })

      return renderHookResult.result.current.listBoxProps.listBoxRect.left
    }

    it('右側に十分なスペースがある場合、入力欄の左端に揃うこと', () => {
      expect(getCalculatedLeft({ triggerLeft: 100, triggerRight: 300, listBoxWidth: 200 })).toBe(
        100,
      )
    })

    it('右側にちょうど収まる場合、入力欄の左端に揃うこと', () => {
      // 右側に使える幅 = 1000 - 500 - 8 = 492
      expect(getCalculatedLeft({ triggerLeft: 500, triggerRight: 700, listBoxWidth: 492 })).toBe(
        500,
      )
    })

    it('右側に収まらず左側に収まる場合、入力欄の右端に揃うこと', () => {
      // 右側に使える幅を 1px 超えるため、入力欄の右端 700 に揃えて左方向に表示する
      expect(getCalculatedLeft({ triggerLeft: 500, triggerRight: 700, listBoxWidth: 493 })).toBe(
        700 - 493,
      )
    })

    it('画面右端に寄った入力欄でも、ドロップダウンの幅が保たれる位置に揃うこと', () => {
      expect(getCalculatedLeft({ triggerLeft: 900, triggerRight: 1000, listBoxWidth: 480 })).toBe(
        1000 - 480,
      )
    })

    it('左右いずれにも収まらない場合、ビューポートの左端に揃うこと', () => {
      expect(
        getCalculatedLeft({
          triggerLeft: 300,
          triggerRight: 500,
          listBoxWidth: VIEWPORT_WIDTH - VIEWPORT_MARGIN,
        }),
      ).toBe(0)
    })
  })
})
