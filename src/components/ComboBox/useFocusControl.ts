import { createRef, useCallback, useMemo, useRef, useState } from 'react'

export function useFocusControl(selectedItemLength: number) {
  const deleteButtonRefs = useMemo(
    () => Array.from({ length: selectedItemLength }).map(() => createRef<HTMLButtonElement>()),
    [selectedItemLength],
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const focusPrevDeleteButton = useCallback(() => {
    if (selectedItemLength === 0) {
      return
    }
    if (focusedIndex === null) {
      if (inputRef.current?.selectionStart === 0) {
        const nextIndex = deleteButtonRefs.length - 1
        deleteButtonRefs[nextIndex].current?.focus()
        setFocusedIndex(nextIndex)
      }
    } else {
      const nextIndex = Math.max(focusedIndex - 1, 0)
      deleteButtonRefs[nextIndex].current?.focus()
      setFocusedIndex(nextIndex)
    }
  }, [deleteButtonRefs, focusedIndex, selectedItemLength])

  const focusNextDeleteButton = useCallback(() => {
    if (deleteButtonRefs.length === 0) {
      return
    }

    if (focusedIndex !== null) {
      const nextIndex = focusedIndex + 1
      if (nextIndex < deleteButtonRefs.length) {
        deleteButtonRefs[nextIndex].current?.focus()
        setFocusedIndex(nextIndex)
      } else {
        setFocusedIndex(null)
        inputRef.current?.focus()
      }
    }
  }, [deleteButtonRefs, focusedIndex])

  const resetDeleteButtonFocus = useCallback(() => {
    setFocusedIndex(null)
  }, [])

  return {
    deleteButtonRefs,
    inputRef,
    focusPrevDeleteButton,
    focusNextDeleteButton,
    resetDeleteButtonFocus,
  }
}
