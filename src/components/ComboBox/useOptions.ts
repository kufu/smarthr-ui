import { useCallback, useEffect, useMemo, useState } from 'react'

import { useId } from '../../hooks/useId'

import { ComboBoxItem, ComboBoxOption } from './types'

export function useOptions<T>({
  items,
  selected,
  creatable,
  inputValue = '',
}: {
  items: Array<ComboBoxItem<T>>
  selected: (ComboBoxItem<T> | null) | Array<ComboBoxItem<T>>
  creatable: boolean
  inputValue?: string
}) {
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null)

  const isInputValueAddable = useMemo(
    () => creatable && inputValue !== '' && !items.some((item) => item.label === inputValue),
    [creatable, inputValue, items],
  )

  const newItemId = useId()
  const optionIdPrefix = useId()
  const getOptionId = useCallback(
    (optionIndex: number) => {
      return `${optionIdPrefix}-${optionIndex}`
    },
    [optionIdPrefix],
  )

  const isSelected = useCallback(
    (item: ComboBoxItem<T>) => {
      if (Array.isArray(selected)) {
        return selected.find((_selected) => _selected.label === item.label) !== undefined
      } else {
        return selected !== null && selected.label === item.label
      }
    },
    [selected],
  )

  const options: Array<ComboBoxOption<T>> = useMemo(() => {
    const _options = items.map((item, i) => ({
      id: getOptionId(i),
      selected: isSelected(item),
      item,
    }))
    if (isInputValueAddable) {
      const addingOption = {
        id: newItemId,
        isNew: true,
        selected: false,
        item: { label: inputValue, value: inputValue },
      }
      return [addingOption, ..._options]
    }
    return _options
  }, [getOptionId, inputValue, isInputValueAddable, isSelected, items, newItemId])

  useEffect(() => {
    // active index を実際の option 数に合わせて補正
    if (activeOptionIndex === null) {
      return
    }
    const corrected = Math.max(Math.min(activeOptionIndex, options.length - 1), 0)
    const active = options[corrected]
    if (!active || active.item.disabled) {
      setActiveOptionIndex(null)
      return
    }
    setActiveOptionIndex(corrected)
  }, [activeOptionIndex, options])

  const activeOption = useMemo(
    () => (activeOptionIndex === null ? null : options[activeOptionIndex]),
    [activeOptionIndex, options],
  )

  const setActiveOption = useCallback(
    (active: ComboBoxOption<T> | null) => {
      if (active === null) {
        setActiveOptionIndex(null)
        return
      }
      const index = options.findIndex((option) => option.id === active.id)
      setActiveOptionIndex(index >= 0 ? index : null)
    },
    [options],
  )

  const moveActiveOptionIndex = useCallback(
    (currentIndex: number | null, delta: -1 | 1) => {
      if (options.filter((option) => !option.item.disabled).length === 0) {
        return
      }
      const nextIndex = (() => {
        if (currentIndex === null) {
          if (delta === 1) {
            return 0
          } else {
            return options.length - 1
          }
        }
        return (currentIndex + delta + options.length) % options.length
      })()
      const nextActive = options[nextIndex]
      if (nextActive && nextActive.item.disabled) {
        // skip disabled item
        moveActiveOptionIndex(nextIndex, delta)
        return
      }
      setActiveOptionIndex(nextIndex)
    },
    [options],
  )

  const moveActivePositionDown = useCallback(() => {
    moveActiveOptionIndex(activeOptionIndex, 1)
  }, [activeOptionIndex, moveActiveOptionIndex])

  const moveActivePositionUp = useCallback(() => {
    moveActiveOptionIndex(activeOptionIndex, -1)
  }, [activeOptionIndex, moveActiveOptionIndex])

  return {
    options,
    activeOption,
    setActiveOption,
    moveActivePositionDown,
    moveActivePositionUp,
  }
}
