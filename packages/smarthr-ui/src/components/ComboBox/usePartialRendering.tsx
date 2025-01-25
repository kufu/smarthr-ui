import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

const OPTION_INCREMENT_AMOUNT = 100
const RETURN_NULL = () => null

export function usePartialRendering<T>({
  items,
  minLength = 0,
}: {
  items: T[]
  minLength?: number
}) {
  const limitter = useCallback((length: number) => Math.max(length, minLength), [minLength])

  const [currentItemLength, setCurrentItemLength] = useState(limitter(OPTION_INCREMENT_AMOUNT))
  // minLength も考慮した実際のアイテム数を算出
  const partialItems = useMemo(() => items.slice(0, currentItemLength), [currentItemLength, items])

  const baseRenderIntersection = useCallback(
    () => (
      <Intersection
        onIntersect={() => {
          setCurrentItemLength((current) => limitter(current + OPTION_INCREMENT_AMOUNT))
        }}
      />
    ),
    [limitter],
  )

  const renderIntersection = useMemo(
    () => (currentItemLength >= items.length ? RETURN_NULL : baseRenderIntersection),
    [items.length, currentItemLength, baseRenderIntersection],
  )

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

  return <div ref={ref} />
}
