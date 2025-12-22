import { useCallback, useId, useMemo } from 'react'
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

  return useOptions<T>(
    // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
    rest,
    isSelected,
  )
}

export const useMultiOptions = <T>({
  selected,
  isItemSelected = defaultIsItemSelected,
  ...rest
}: BaseUseOptionsProps<T> & {
  selected: Array<ComboboxItem<T>>
  isItemSelected?: (targetItem: ComboboxItem<T>, selectedItems: Array<ComboboxItem<T>>) => boolean
}) => {
  const isSelected = useCallback(
    (item: ComboboxItem<T>) => isItemSelected(item, selected),
    [selected, isItemSelected],
  )

  return useOptions<T>(
    // eslint-disable-next-line smarthr/best-practice-for-rest-parameters
    rest,
    isSelected,
  )
}

function useOptions<T>(
  { items, creatable, inputValue = '', isFilteringDisabled = false }: BaseUseOptionsProps<T>,
  isSelected: (item: ComboboxItem<T>) => boolean,
) {
  const newItemId = useId()
  const optionIdPrefix = useId()

  const existedOptions: Array<ComboboxOption<T>> = useMemo(
    () =>
      items.map((item, i) => ({
        id: `${optionIdPrefix}-${i}`,
        selected: isSelected(item),
        isNew: false,
        item,
      })),
    [isSelected, items, optionIdPrefix],
  )
  const addingOption: ComboboxOption<T> | null = useMemo(
    () =>
      creatable && inputValue && items.every((item) => item.label !== inputValue)
        ? {
            id: newItemId,
            isNew: true,
            selected: false,
            item: { label: inputValue, value: inputValue },
          }
        : null,
    [inputValue, items, creatable, newItemId],
  )

  const allOptions: Array<ComboboxOption<T>> = useMemo(
    () => (addingOption ? [addingOption, ...existedOptions] : existedOptions),
    [existedOptions, addingOption],
  )

  const options = useMemo(() => {
    if (isFilteringDisabled || !inputValue) {
      return allOptions
    }

    return allOptions.filter(({ item: { label } }) =>
      convertMatchableString(innerText(label)).includes(convertMatchableString(inputValue)),
    )
  }, [allOptions, inputValue, isFilteringDisabled])

  return {
    options,
  }
}
