import { createRef, useCallback, useMemo, useRef, useState } from 'react'

export function useFocusControl(selectedItemLength: number) {
  const deletionButtonRefs = useMemo(() => {
    const refs: ReturnType<typeof createRef<HTMLButtonElement>>[] = []

    for (let i = 0; i < selectedItemLength; i++) {
      refs[i] = createRef<HTMLButtonElement>()
    }

    return refs
  }, [selectedItemLength])
  const inputRef = useRef<HTMLInputElement>(null)

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const focusPrevDeletionButton = useCallback(() => {
    if (selectedItemLength === 0) {
      return
    }

    if (focusedIndex !== null) {
      const nextIndex = Math.max(focusedIndex - 1, 0)

      deletionButtonRefs[nextIndex].current?.focus()
      setFocusedIndex(nextIndex)
    } else if (inputRef.current?.selectionStart === 0) {
      const nextIndex = deletionButtonRefs.length - 1

      deletionButtonRefs[nextIndex].current?.focus()
      setFocusedIndex(nextIndex)
    }
  }, [deletionButtonRefs, focusedIndex, selectedItemLength])

  const focusNextDeletionButton = useCallback(() => {
    if (deletionButtonRefs.length === 0 || focusedIndex === null) {
      return
    }

    const nextIndex = focusedIndex + 1

    if (nextIndex < deletionButtonRefs.length) {
      deletionButtonRefs[nextIndex].current?.focus()
      setFocusedIndex(nextIndex)
    } else {
      setFocusedIndex(null)
      // キー入力が input に影響しないようにフォーカスタイミングを遅らせる
      setTimeout(() => {
        inputRef.current?.focus()
      })
    }
  }, [deletionButtonRefs, focusedIndex])

  const resetDeletionButtonFocus = useCallback(() => {
    setFocusedIndex(null)
  }, [])

  return {
    deletionButtonRefs,
    inputRef,
    focusPrevDeletionButton,
    focusNextDeletionButton,
    resetDeletionButtonFocus,
  }
}
