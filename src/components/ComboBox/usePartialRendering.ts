import { RefObject, useEffect, useMemo, useState } from 'react'

const OPTION_INCREMENT_AMOUNT = 100

export function usePartialRendering<T, U extends Element>({
  items,
  bottomIntersectionRef,
  minLength = 0,
}: {
  items: T[]
  bottomIntersectionRef: RefObject<U>
  minLength?: number
}) {
  const [currentItemLength, setCurrentItemLength] = useState(
    Math.max(OPTION_INCREMENT_AMOUNT, minLength),
  )
  // minLength も考慮した実際のアイテム数を算出
  const actualLength = useMemo(() => {
    return Math.max(currentItemLength, minLength)
  }, [currentItemLength, minLength])
  const partialItems = useMemo(() => items.slice(0, actualLength), [actualLength, items])

  useEffect(() => {
    // currentItemLength を実際の値に補正
    setCurrentItemLength(actualLength)
  }, [actualLength])

  const isAllItemsShown = useMemo(() => actualLength >= items.length, [actualLength, items.length])

  // IntersectionObserver を設定
  useEffect(() => {
    if (isAllItemsShown) {
      return
    }
    // スクロール最下部に到達する度に表示するアイテム数を増加させるための IntersectionObserver
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCurrentItemLength((current) => current + OPTION_INCREMENT_AMOUNT)
      }
    })

    // bottomIntersection のレンダリングを待つ
    setTimeout(() => {
      const target = bottomIntersectionRef.current
      if (target) {
        observer.observe(target)
      }
    })
    return () => observer.disconnect()
  }, [bottomIntersectionRef, isAllItemsShown])

  return partialItems
}
