import { useCallback, useEffect, useState } from 'react'

import { ComboBoxOption } from './types'

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
      const nextIndex = (() => {
        if (currentActiveIndex === -1) {
          if (delta === 1) {
            return 0
          } else {
            return options.length - 1
          }
        }
        return (currentActiveIndex + delta + options.length) % options.length
      })()
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

  const moveActivePositionDown = useCallback(() => {
    moveActiveOptionIndex(activeOption, 1)
  }, [activeOption, moveActiveOptionIndex])

  const moveActivePositionUp = useCallback(() => {
    moveActiveOptionIndex(activeOption, -1)
  }, [activeOption, moveActiveOptionIndex])

  return {
    activeOption,
    setActiveOption,
    moveActivePositionDown,
    moveActivePositionUp,
  }
}
