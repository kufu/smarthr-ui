import { renderHook } from '@testing-library/react'

import { useMultiOptions } from '../useOptions'

describe('useMultiOptions', () => {
  describe('options', () => {
    it('options が取得できること', () => {
      const initialProps = {
        items: [
          { label: 'label1', value: 'value1' },
          { label: 'label2', value: 'value2' },
          { label: 'label3', value: 'value3' },
        ],
        selected: [{ label: 'label2', value: 'value2' }],
        creatable: false,
      }
      const { result } = renderHook((props) => useMultiOptions(props), { initialProps })
      const options = result.current.options

      expect(options.length).toBe(3)
      expect(options[0].item).toEqual({ label: 'label1', value: 'value1' })
      expect(options[0].selected).toBeFalsy()
      expect(options[0].isNew).toBeFalsy()

      expect(options[1].item).toEqual({ label: 'label2', value: 'value2' })
      expect(options[1].selected).toBeTruthy()
      expect(options[1].isNew).toBeFalsy()

      expect(options[2].item).toEqual({ label: 'label3', value: 'value3' })
      expect(options[2].selected).toBeFalsy()
      expect(options[2].isNew).toBeFalsy()
    })

    it('入力によって options がフィルタリングされること', () => {
      const initialProps = {
        items: [
          { label: 'label1', value: 'value1' },
          { label: 'label2', value: 'value2' },
          { label: 'label3', value: 'value3' },
        ],
        selected: [{ label: 'label2', value: 'value2' }],
        creatable: false,
        inputValue: '2',
      }
      const { result } = renderHook((props) => useMultiOptions(props), { initialProps })
      const options = result.current.options

      expect(options.length).toBe(1)
      expect(options[0].item).toEqual({ label: 'label2', value: 'value2' })
    })

    it('新規追加オプションが取得できること', () => {
      const initialProps = {
        items: [],
        selected: null,
        creatable: true,
        inputValue: 'input_data',
      }
      const { result, rerender } = renderHook((props) => useMultiOptions(props), { initialProps })

      const options1 = result.current.options
      expect(options1.length).toBe(1)
      expect(options1[0].item).toEqual({ label: 'input_data', value: 'input_data' })
      expect(options1[0].selected).toBeFalsy()
      expect(options1[0].isNew).toBeTruthy()

      rerender({
        ...initialProps,
        creatable: false,
        inputValue: 'input_data',
      })
      const options2 = result.current.options
      expect(options2.length).toBe(0)

      rerender({
        ...initialProps,
        creatable: true,
        inputValue: '',
      })
      const options3 = result.current.options
      expect(options3.length).toBe(0)
    })

    describe('isItemSelectedが渡されたとき', () => {
      const isItemSelected = vi.fn((_targetItem, _selectedItems) => true)
      it('selectedかどうかの判定の際にitemの数だけisItemSelectedが呼ばれること', () => {
        const selected = [{ label: 'label2', value: 'value2' }]
        const initialProps = {
          items: [
            { label: 'label1', value: 'value1' },
            { label: 'label2', value: 'value2' },
            { label: 'label3', value: 'value3' },
          ],
          selected,
          creatable: false,
          isItemSelected,
        }
        renderHook((props) => useMultiOptions(props), { initialProps })
        expect(isItemSelected).toHaveBeenNthCalledWith(
          1,
          { label: 'label1', value: 'value1' },
          selected,
        )
        expect(isItemSelected).toHaveBeenNthCalledWith(
          2,
          { label: 'label2', value: 'value2' },
          selected,
        )
        expect(isItemSelected).toHaveBeenNthCalledWith(
          3,
          { label: 'label3', value: 'value3' },
          selected,
        )
        expect(isItemSelected).toHaveBeenCalledTimes(3)
      })
    })
  })
})
