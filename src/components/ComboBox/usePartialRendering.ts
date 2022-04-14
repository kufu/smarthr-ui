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
  const [currentItemLength, setCurrentItemLength] = useState(OPTION_INCREMENT_AMOUNT)
  const actualLength = useMemo(
    () => Math.max(currentItemLength, minLength),
    [currentItemLength, minLength],
  )
  const partialItems = useMemo(() => items.slice(0, actualLength), [actualLength, items])

  useEffect(() => {
    // 表示アイテム数を初期化
    setCurrentItemLength(actualLength)
  }, [actualLength])

  // スクロール最下部に到達する度に表示するアイテム数を増加させるための IntersectionObserver
  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCurrentItemLength((current) => current + OPTION_INCREMENT_AMOUNT)
      }
    })
  }, [])

  const isAllItemsShown = useMemo(() => actualLength >= items.length, [actualLength, items.length])
  // IntersectionObserver を設定
  useEffect(() => {
    const target = bottomIntersectionRef.current
    if (!target || isAllItemsShown) {
      return
    }

    observer.observe(target)
    return () => observer.unobserve(target)
  }, [bottomIntersectionRef, isAllItemsShown, observer])

  return partialItems
}
