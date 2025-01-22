import { useEffect, useState } from 'react'

export const useBodyScrollLock = (isOpen: boolean) => {
  const [paddingRight, setPaddingRight] = useState<number | null>(null)

  useEffect(() => {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth
    const originalPaddingRight = getComputedStyle(document.body).getPropertyValue('padding-right')

    setPaddingRight(scrollBarWidth + parseInt(originalPaddingRight, 10))
  }, [])

  useEffect(() => {
    if (!isOpen) return

    if (paddingRight !== null) {
      document.body.style.paddingInlineEnd = `${paddingRight}px`
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.paddingInlineEnd = ''
      document.body.style.overflow = ''
    }
  }, [isOpen, paddingRight])
}
