import React, { useCallback, useEffect, useState } from 'react'

import { MultiSelectedItem } from './MultiSelectedItem'
import { ComboBoxItem } from './types'

export function useMultiSelectedItems<T>({
  selectedItems,
  onDelete,
  disabled,
  enableEllipsis,
  focusInput,
}: {
  selectedItems: Array<ComboBoxItem<T>>
  onDelete: (item: ComboBoxItem<T>) => void
  disabled: boolean
  enableEllipsis: boolean
  focusInput: () => void
}) {
  const [focusedSelectedItemIndex, setFocusedSelectedItemIndex] = useState<number | null>(null)

  useEffect(() => {
    if (focusedSelectedItemIndex === null) {
      return
    }
    if (selectedItems.length === 0) {
      setFocusedSelectedItemIndex(null)
    } else {
      setFocusedSelectedItemIndex(Math.min(focusedSelectedItemIndex, selectedItems.length - 1))
    }
  }, [focusedSelectedItemIndex, selectedItems.length])

  const renderSelectedItems = useCallback(() => {
    return selectedItems.map((selectedItem, i) => (
      <li key={selectedItem.label}>
        <MultiSelectedItem
          item={selectedItem}
          disabled={disabled}
          onDelete={() => {
            onDelete(selectedItem)
          }}
          enableEllipsis={enableEllipsis}
          focused={i === focusedSelectedItemIndex}
        />
      </li>
    ))
  }, [disabled, enableEllipsis, focusedSelectedItemIndex, onDelete, selectedItems])

  const moveFocusLeft = useCallback(() => {
    if (focusedSelectedItemIndex === null) {
      if (selectedItems.length > 0) {
        setFocusedSelectedItemIndex(selectedItems.length - 1)
      }
    } else {
      setFocusedSelectedItemIndex(Math.max(focusedSelectedItemIndex - 1, 0))
    }
  }, [focusedSelectedItemIndex, selectedItems.length])

  const moveFocusRight = useCallback(() => {
    if (focusedSelectedItemIndex !== null) {
      const nextIndex = focusedSelectedItemIndex + 1
      if (nextIndex < selectedItems.length) {
        setFocusedSelectedItemIndex(nextIndex)
      } else {
        setFocusedSelectedItemIndex(null)
        focusInput()
      }
    }
  }, [focusInput, focusedSelectedItemIndex, selectedItems.length])

  return {
    renderSelectedItems,
    moveFocusLeft,
    moveFocusRight,
  }
}
