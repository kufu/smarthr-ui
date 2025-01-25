import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const OPTION_INCREMENT_AMOUNT = 100

export function usePartialRendering<T>({
  items,
  minLength = 0,
}: {
  items: T[]
  minLength?: number
}) {
  const limitter = useCallback((length: number) => Math.max(number, minLength), [minLength])

  const [currentItemLength, setCurrentItemLength] = useState(limitter(OPTION_INCREMENT_AMOUNT))
  // minLength も考慮した実際のアイテム数を算出
  const partialItems = useMemo(() => items.slice(0, currentItemLength), [currentItemLength, items])

  const isAllItemsShown = useMemo(
    () => currentItemLength >= items.length,
    [currentItemLength, items.length],
  )

  const handleIntersect = useCallback(() => {
    setCurrentItemLength((current) => limitter(current + OPTION_INCREMENT_AMOUNT))
  }, [limitter])

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
