import { useEffect } from 'react'

export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return

    const scrollBarWidth = window.innerWidth - document.body.clientWidth
    const originalPaddingRight = getComputedStyle(document.body).getPropertyValue('padding-right')

    document.body.style.paddingInlineEnd = `${scrollBarWidth + parseInt(originalPaddingRight, 10)}px`
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.paddingInlineEnd = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])
}
