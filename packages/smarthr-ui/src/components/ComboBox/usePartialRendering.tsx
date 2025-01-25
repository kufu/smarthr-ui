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
  const limiter = useCallback((length: number) => Math.max(length, minLength), [minLength])

  const [currentItemLength, setCurrentItemLength] = useState(limiter(OPTION_INCREMENT_AMOUNT))

  useEffect(() => {
    setCurrentItemLength((current) => limiter(current))
  }, [limiter])

  // minLength も考慮した実際のアイテム数を算出
  const partialItems = useMemo(() => items.slice(0, currentItemLength), [currentItemLength, items])

  const renderIntersection = useCallback(
    () => (
      <Intersection
        onIntersect={() => {
          setCurrentItemLength((current) => limiter(current + OPTION_INCREMENT_AMOUNT))
        }}
      />
    ),
    [limiter],
  )

  return {
    items: partialItems,
    renderIntersection: currentItemLength >= items.length ? RETURN_NULL : renderIntersection,
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
