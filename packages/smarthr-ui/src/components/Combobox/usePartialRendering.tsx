import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

  const onIntersect = useCallback(() => {
    setCurrentItemLength((current) => Math.max(current + OPTION_INCREMENT_AMOUNT, minLength))
  }, [minLength])

  useEffect(() => {
    setCurrentItemLength((current) => Math.max(current, minLength))
  }, [minLength])

  return {
    items: partialItems,
    onIntersect: currentItemLength >= items.length ? undefined : onIntersect,
  }
}

export const Intersection: FC<{ onIntersect: () => void }> = ({ onIntersect }) => {
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
