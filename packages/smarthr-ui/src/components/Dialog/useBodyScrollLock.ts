import { useEffect, useRef } from 'react'

export const useBodyScrollLock = (isOpen: boolean) => {
  const paddingRightRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    if (paddingRightRef.current === null) {
      const scrollBarWidth = window.innerWidth - document.body.clientWidth
      const originalPaddingRight = getComputedStyle(document.body).getPropertyValue('padding-right')

      paddingRightRef.current = `${scrollBarWidth + parseInt(originalPaddingRight, 10)}px`
    }

    document.body.style.paddingInlineEnd = paddingRightRef.current
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.paddingInlineEnd = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])
}
