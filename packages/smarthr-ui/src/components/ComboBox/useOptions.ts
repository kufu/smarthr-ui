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

export function useOptions<T>({
  items,
  selected,
  creatable,
  inputValue = '',
  isFilteringDisabled = false,
  isItemSelected = defaultIsItemSelected,
}: {
  items: Array<ComboBoxItem<T>>
  selected: (ComboBoxItem<T> | null) | Array<ComboBoxItem<T>>
  creatable: boolean
  inputValue?: string
  isFilteringDisabled?: boolean
  isItemSelected?: (targetItem: ComboBoxItem<T>, selectedItems: Array<ComboBoxItem<T>>) => boolean
}) {
  const isInputValueAddable = useMemo(
    () => creatable && inputValue && items.every((item) => item.label !== inputValue),
    [creatable, inputValue, items],
  )

  const newItemId = useId()
  const optionIdPrefix = useId()

  const isSelected = useCallback(
    (item: ComboBoxItem<T>) => {
      if (Array.isArray(selected)) {
        return isItemSelected(item, selected)
      } else {
        return selected !== null && selected.label === item.label
      }
    },
    [isItemSelected, selected],
  )

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
  const addingOption = useMemo(
    () =>
      isInputValueAddable
        ? {
            id: newItemId,
            isNew: true,
            selected: false,
            item: { label: inputValue, value: inputValue },
          }
        : null,
    [inputValue, isInputValueAddable, newItemId],
  )

  const allOptions: Array<ComboBoxOption<T>> = useMemo(
    () => (addingOption ? [addingOption, ...existedOptions] : existedOptions),
    [existedOptions, addingOption],
  )

  const options = useMemo(() => {
    if (isFilteringDisabled) {
      return allOptions
    }
    return allOptions.filter(({ item: { label } }) => {
      if (!inputValue) return true
      return convertMatchableString(innerText(label)).includes(convertMatchableString(inputValue))
    })
  }, [allOptions, inputValue, isFilteringDisabled])

  return {
    options,
  }
}
