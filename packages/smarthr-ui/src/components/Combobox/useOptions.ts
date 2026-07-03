import { useCallback, useId, useMemo, useRef } from 'react'
import innerText from 'react-innertext'

import { areItemsEqual, convertMatchableString } from './helper'

import type { ComboboxItem, ComboboxOption } from './types'

const defaultIsItemSelected = <T>(
  targetItem: ComboboxItem<T>,
  selectedItems: Array<ComboboxItem<T>>,
) => selectedItems.some((item) => areItemsEqual(item, targetItem))

type BaseUseOptionsProps<T> = {
  items: Array<ComboboxItem<T>>
  creatable?: boolean
  inputValue?: string
  isFilteringDisabled?: boolean
}

export const useSingleOptions = <T>({
  selected,
  ...rest
}: BaseUseOptionsProps<T> & {
  selected: ComboboxItem<T> | null
}) => {
  const isSelected = useCallback(
    (item: ComboboxItem<T>) => selected !== null && areItemsEqual(selected, item),
    [selected],
  )

  return useOptions<T>(rest, isSelected)
}

export const useMultiOptions = <T>({
  selected,
  isItemSelected = defaultIsItemSelected,
  ...rest
}: BaseUseOptionsProps<T> & {
  selected: Array<ComboboxItem<T>>
  isItemSelected?: (targetItem: ComboboxItem<T>, selectedItems: Array<ComboboxItem<T>>) => boolean
}) => {
  const propsRef = useRef({ selected, isItemSelected })
  propsRef.current = { selected, isItemSelected }

  const isSelected = useCallback(
    (item: ComboboxItem<T>) => propsRef.current.isItemSelected(item, propsRef.current.selected),
    [],
  )

  return useOptions<T>(rest, isSelected)
}

function useOptions<T>(
  { items, creatable, inputValue = '', isFilteringDisabled = false }: BaseUseOptionsProps<T>,
  isSelected: (item: ComboboxItem<T>) => boolean,
) {
  const newItemId = useId()
  const optionIdPrefix = useId()

  const options = useMemo(() => {
    const existedOptions: Array<ComboboxOption<T>> = items.map((item, i) => ({
      id: `${optionIdPrefix}-${i}`,
      selected: isSelected(item),
      isNew: false,
      item,
    }))

    const allOptions =
      creatable && inputValue && items.every((item) => item.label !== inputValue)
        ? [
            {
              id: newItemId,
              isNew: true,
              selected: false,
              item: { label: inputValue, value: inputValue },
            } as ComboboxOption<T>,
            ...existedOptions,
          ]
        : existedOptions

    if (isFilteringDisabled || !inputValue) {
      return allOptions
    }

    const convertedInputtedValue = convertMatchableString(inputValue)

    return allOptions.filter(({ item: { label } }) =>
      convertMatchableString(innerText(label)).includes(convertedInputtedValue),
    )
    // TODO: itemsの安定化方法を検討中
  }, [isSelected, items, optionIdPrefix, inputValue, creatable, newItemId, isFilteringDisabled])

  return {
    options,
  }
}
