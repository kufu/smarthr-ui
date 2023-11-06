import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const OPTION_INCREMENT_AMOUNT = 100

export function usePartialRendering<T>({
  items,
  minLength = 0,
}: {
  items: T[]
  minLength?: number
}) {
  const [currentItemLength, setCurrentItemLength] = useState(
    Math.max(OPTION_INCREMENT_AMOUNT, minLength),
  )
  // minLength も考慮した実際のアイテム数を算出
  const actualLength = useMemo(
    () => Math.max(currentItemLength, minLength),
    [currentItemLength, minLength],
  )
  const partialItems = useMemo(() => items.slice(0, actualLength), [actualLength, items])

  useEffect(() => {
    // currentItemLength を実際の値に補正
    setCurrentItemLength(actualLength)
  }, [actualLength])

  const isAllItemsShown = useMemo(() => actualLength >= items.length, [actualLength, items.length])

  const handleIntersect = useCallback(() => {
    setCurrentItemLength((current) => current + OPTION_INCREMENT_AMOUNT)
  }, [])

  const renderIntersection = useCallback(() => {
    if (isAllItemsShown) {
      return null
    }
    return <Intersection onIntersect={handleIntersect} />
  }, [handleIntersect, isAllItemsShown])

  return {
    items: partialItems,
    renderIntersection,
  }
}

const Intersection: FC<{ onIntersect: () => void }> = ({ onIntersect }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = ref.current
    if (target === null) {
      return
    }
    // スクロール最下部に到達する度に表示するアイテム数を増加させるための IntersectionObserver
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect()
      }
    })

    observer.observe(target)
    return () => observer.disconnect()
  }, [onIntersect])

  return <div ref={ref}></div>
}
