import { act, renderHook } from '@testing-library/react'

import { useActiveOption } from '../useActiveOption'

describe('useActiveOption', () => {
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
      { id: 'id4', selected: false, isNew: false, item: { label: 'label3', value: 'value3' } },
    ],
  }
  const resultDummy = renderHook((props) => useActiveOption(props), {
    initialProps,
  })

  let result: (typeof resultDummy)['result']
  let rerender: (typeof resultDummy)['rerender']
  beforeEach(() => {
    const renderHookResult = renderHook((props) => useActiveOption(props), { initialProps })
    result = renderHookResult.result
    rerender = renderHookResult.rerender
  })

  it('options が変更されても activeOption が維持されること', () => {
    act(() => result.current.moveActivePositionDown())
    expect(result.current.activeOption).toEqual(initialProps.options[0])
    rerender({
      options: [
        ...initialProps.options,
        { id: 'id4', selected: false, isNew: false, item: { label: 'label4', value: 'value4' } },
      ],
    })
    expect(result.current.activeOption).toEqual(initialProps.options[0])
  })

  it('options から activeOption と一致する option が消えたとき、activeOption がリセットされること', () => {
    act(() => result.current.moveActivePositionDown())
    expect(result.current.activeOption).toEqual(initialProps.options[0])
    rerender({
      options: initialProps.options.slice(1),
    })
    expect(result.current.activeOption).toBeNull()
  })

  it('activeOption をセットできること', () => {
    act(() => result.current.setActiveOption(initialProps.options[2]))
    expect(result.current.activeOption).toEqual(initialProps.options[2])
  })

  describe('moveActivePositionDown', () => {
    it('activeOption が未設定のとき、最初に先頭のアイテムが選択されること', () => {
      act(() => result.current.moveActivePositionDown())
      expect(result.current.activeOption).toEqual(initialProps.options[0])
    })

    it('disabled な option が飛ばされること', () => {
      act(() => result.current.setActiveOption(initialProps.options[1]))
      act(() => result.current.moveActivePositionDown())
      expect(result.current.activeOption).toEqual(initialProps.options[3])
    })

    it('末尾の option から 先頭の option にループすること', () => {
      act(() =>
        result.current.setActiveOption(initialProps.options[initialProps.options.length - 1]),
      )
      act(() => result.current.moveActivePositionDown())
      expect(result.current.activeOption).toEqual(initialProps.options[0])
    })
  })

  describe('moveActivePositionUp', () => {
    it('activeOption を変更できること', () => {
      expect(result.current.activeOption).toBeNull()

      act(() => result.current.moveActivePositionUp())
      expect(result.current.activeOption).toEqual(initialProps.options[3])

      act(() => result.current.moveActivePositionUp())
      act(() => result.current.moveActivePositionUp())
      expect(result.current.activeOption).toEqual(initialProps.options[0])

      act(() => result.current.moveActivePositionUp())
      expect(result.current.activeOption).toEqual(initialProps.options[3])
    })
  })
})
