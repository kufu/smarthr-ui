'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

const OPTION_INCREMENT_AMOUNT = 100

export function usePartialRendering<T>({
  items,
  minLength = 0,
}: {
  items: T[]
  minLength?: number
}) {
  const [currentItemLength, setCurrentItemLength] = useState(() =>
    Math.max(OPTION_INCREMENT_AMOUNT, minLength),
  )
  // minLength も考慮した実際のアイテム数を算出
  const partialItems = useMemo(() => items.slice(0, currentItemLength), [currentItemLength, items])

  const latest = useLatest({ minLength })

  const handleIntersect = useCallback(() => {
    setCurrentItemLength((current) => Math.max(current + OPTION_INCREMENT_AMOUNT, latest.minLength))
  }, [latest])

  useEffect(() => {
    setCurrentItemLength((current) => Math.max(current, minLength))
  }, [minLength])

  return {
    items: partialItems,
    handleIntersect: currentItemLength >= items.length ? undefined : handleIntersect,
  }
}

export const Intersection = memo<{ handleIntersect: () => void }>(({ handleIntersect }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = ref.current

    if (target === null) {
      return
    }

    // スクロール最下部に到達する度に表示するアイテム数を増加させるための IntersectionObserver
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        handleIntersect()
      }
    })

    observer.observe(target)

    return () => observer.disconnect()
  }, [handleIntersect])

  return <div ref={ref} />
})
