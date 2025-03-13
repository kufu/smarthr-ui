import { useCallback, useId, useMemo } from 'react'
import innerText from 'react-innertext'

import { areComboBoxItemsEqual, convertMatchableString } from './comboBoxHelper'
import { type ComboBoxItem, type ComboBoxOption } from './types'

const defaultIsItemSelected = <T>(
  targetItem: ComboBoxItem<T>,
  selectedItems: Array<ComboBoxItem<T>>,
) => selectedItems.some((item) => areComboBoxItemsEqual(item, targetItem))

type BaseUseOptionsProps<T> = {
  items: Array<ComboBoxItem<T>>
  creatable: boolean
  inputValue?: string
  isFilteringDisabled?: boolean
}

export const useSingleOptions = <T>({
  selected,
  ...rest
}: BaseUseOptionsProps<T> & {
  selected: ComboBoxItem<T> | null
}) => {
  const isSelected = useCallback(
    (item: ComboBoxItem<T>) => selected !== null && areComboBoxItemsEqual(selected, item),
    [selected],
  )

  return useOptions<T>(rest, isSelected)
}

export const useMultiOptions = <T>({
  selected,
  isItemSelected = defaultIsItemSelected,
  ...rest
}: BaseUseOptionsProps<T> & {
  selected: Array<ComboBoxItem<T>>
  isItemSelected?: (targetItem: ComboBoxItem<T>, selectedItems: Array<ComboBoxItem<T>>) => boolean
}) => {
  const isSelected = useCallback(
    (item: ComboBoxItem<T>) => isItemSelected(item, selected),
    [selected, isItemSelected],
  )

  return useOptions<T>(rest, isSelected)
}

function useOptions<T>(
  { items, creatable, inputValue = '', isFilteringDisabled = false }: BaseUseOptionsProps<T>,
  isSelected: (item: ComboBoxItem<T>) => boolean,
) {
  const newItemId = useId()
  const optionIdPrefix = useId()

  const existedOptions: Array<ComboBoxOption<T>> = useMemo(
    () =>
      items.map((item, i) => ({
        id: `${optionIdPrefix}-${i}`,
        selected: isSelected(item),
        isNew: false,
        item,
      })),
    [isSelected, items, optionIdPrefix],
  )
  const addingOption: ComboBoxOption<T> | null = useMemo(
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

  const allOptions: Array<ComboBoxOption<T>> = useMemo(
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
