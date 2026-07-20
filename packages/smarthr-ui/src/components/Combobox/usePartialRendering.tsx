import { type FC, memo, useCallback, useEffect, useRef, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

const OPTION_INCREMENT_AMOUNT = 100

export function usePartialRendering<T>({
  items,
  minLength = 0,
}: {
  items: T[]
  minLength?: number
}) {
  const limiter = useCallback((length: number) => Math.max(length, minLength), [minLength])

  const [currentItemLength, setCurrentItemLength] = useState(limiter(OPTION_INCREMENT_AMOUNT))

  const latest = useLatest({ limiter })

  const handleIntersect = useCallback(() => {
    setCurrentItemLength((current) => latest.limiter(current + OPTION_INCREMENT_AMOUNT))
  }, [latest])

  useEffect(() => {
    setCurrentItemLength((current) => limiter(current))
  }, [limiter])

  return {
    // minLength も考慮した実際のアイテム数を算出
    // itemsはunstableなのでuseMemoは毎回再計算されるため、直接計算する
    items: items.slice(0, currentItemLength),
    handleIntersect: currentItemLength < items.length ? handleIntersect : null,
  }
}

export const Intersection: FC<{ handleIntersect: () => void }> = memo(({ handleIntersect }) => {
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
