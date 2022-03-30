import { useEffect, useMemo, useState } from 'react'

const OPTION_INCREMENT_AMOUNT = 100

export function usePartialRendering<T, U extends Element>({
  items,
  bottomElement,
}: {
  items: T[]
  bottomElement: U | null
}) {
  const [currentItemLength, setCurrentItemLength] = useState(OPTION_INCREMENT_AMOUNT)
  const partialItems = useMemo(
    () => items.slice(0, currentItemLength + 1),
    [currentItemLength, items],
  )

  useEffect(() => {
    // 表示アイテム数を初期化
    setCurrentItemLength(OPTION_INCREMENT_AMOUNT)
  }, [items])

  // スクロール最下部に到達する度に表示するアイテム数を増加させるための IntersectionObserver
  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCurrentItemLength((current) => current + OPTION_INCREMENT_AMOUNT)
      }
    })
  }, [])

  // IntersectionObserver を設定
  useEffect(() => {
    const isAllItemsShown = currentItemLength >= items.length
    if (!bottomElement || isAllItemsShown) {
      return
    }

    observer.observe(bottomElement)
    return () => observer.unobserve(bottomElement)
  }, [bottomElement, currentItemLength, items.length, observer])

  return partialItems
}
