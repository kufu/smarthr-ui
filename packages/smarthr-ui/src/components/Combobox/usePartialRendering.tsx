import { type FC, memo, useCallback, useEffect, useRef, useState } from 'react'

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

  const limiterRef = useRef(limiter)
  limiterRef.current = limiter

  useEffect(() => {
    setCurrentItemLength((current) => limiter(current))
  }, [limiter])

  // minLength も考慮した実際のアイテム数を算出
  // itemsはunstableなのでuseMemoは毎回再計算されるため、直接計算する
  const partialItems = items.slice(0, currentItemLength)

  const onIntersect = useCallback(() => {
    setCurrentItemLength((current) => limiterRef.current(current + OPTION_INCREMENT_AMOUNT))
  }, [])

  return {
    items: partialItems,
    onIntersect: currentItemLength < items.length ? onIntersect : null,
  }
}

export const Intersection: FC<{ onIntersect: () => void }> = memo(({ onIntersect }) => {
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
})
