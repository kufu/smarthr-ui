import { useCallback, useId, useMemo } from 'react'
import innerText from 'react-innertext'

import { convertMatchableString } from './comboBoxHelper'
import { ComboBoxItem, ComboBoxOption } from './types'

const defaultIsItemSelected = <T>(
  targetItem: ComboBoxItem<T>,
  selectedItems: Array<ComboBoxItem<T>>,
) =>
  selectedItems.find(
    (selectedItem) =>
      selectedItem.label === targetItem.label && selectedItem.value === targetItem.value,
  ) !== undefined

export const useSingleOptions = <T>({
  selected,
  ...rest
}: {
  selected: ComboBoxItem<T> | null
  items: Array<ComboBoxItem<T>>
  creatable: boolean
  inputValue?: string
  isFilteringDisabled?: boolean
}) => {
  const isSelected = useCallback(
    (item: ComboBoxItem<T>) => selected !== null && selected.label === item.label,
    [selected],
  )

  return useOptions<T>({ ...rest, isSelected })
}

export const useMultiOptions = <T>({
  selected,
  isItemSelected = defaultIsItemSelected,
  ...rest
}: {
  selected: Array<ComboBoxItem<T>>
  isItemSelected?: (targetItem: ComboBoxItem<T>, selectedItems: Array<ComboBoxItem<T>>) => boolean
  items: Array<ComboBoxItem<T>>
  creatable: boolean
  inputValue?: string
  isFilteringDisabled?: boolean
}) => {
  const isSelected = useCallback(
    (item: ComboBoxItem<T>) => isItemSelected(item, selected),
    [selected, isItemSelected],
  )

  return useOptions<T>({ ...rest, isSelected })
}

function useOptions<T>({
  items,
  isSelected,
  creatable,
  inputValue = '',
  isFilteringDisabled = false,
  isItemSelected = defaultIsItemSelected,
}: {
  items: Array<ComboBoxItem<T>>
  isSelected: (item: ComboBoxItem<T>) => boolean
  creatable: boolean
  inputValue?: string
  isFilteringDisabled?: boolean
  isItemSelected?: (targetItem: ComboBoxItem<T>, selectedItems: Array<ComboBoxItem<T>>) => boolean
}) {
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
