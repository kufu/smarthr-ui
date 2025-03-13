import { useCallback, useEffect, useState } from 'react'

import { type ComboBoxOption } from './types'

export function useActiveOption<T>({ options }: { options: Array<ComboBoxOption<T>> }) {
  const [activeOption, setActiveOption] = useState<ComboBoxOption<T> | null>(null)

  useEffect(() => {
    // props の変更によって activeOption の状態が変わりうるので、実態を反映する
    setActiveOption((current) => {
      if (current === null) {
        return null
      }

      return options.find((option) => current.id === option.id) ?? null
    })
  }, [options])

  const moveActiveOptionIndex = useCallback(
    (currentActive: ComboBoxOption<T> | null, delta: -1 | 1) => {
      if (options.every((option) => option.item.disabled)) {
        return
      }

      const currentActiveIndex =
        currentActive === null ? -1 : options.findIndex((option) => option.id === currentActive.id)
      let nextIndex = 0

      if (currentActiveIndex !== -1) {
        nextIndex = (currentActiveIndex + delta + options.length) % options.length
      } else if (delta !== 1) {
        nextIndex = options.length - 1
      }

      const nextActive = options[nextIndex]

      if (nextActive) {
        if (nextActive.item.disabled) {
          // skip disabled item
          moveActiveOptionIndex(nextActive, delta)
        } else {
          setActiveOption(nextActive)
        }
      }
    },
    [options],
  )

  return {
    activeOption,
    setActiveOption,
    moveActiveOptionIndex,
  }
}
