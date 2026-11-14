import { useLayoutEffect } from 'react'

export const useBodyScrollLock = (isOpen: boolean) => {
  useLayoutEffect(() => {
    if (!isOpen) return

    const body = document.body
    const scrollBarWidth = window.innerWidth - body.clientWidth
    const originalPaddingRight = getComputedStyle(body).getPropertyValue('padding-right')

    const bodyStyle = body.style

    bodyStyle.paddingInlineEnd = `${scrollBarWidth + parseInt(originalPaddingRight, 10)}px`
    bodyStyle.overflow = 'hidden'

    return () => {
      bodyStyle.paddingInlineEnd = ''
      bodyStyle.overflow = ''
    }
  }, [isOpen])
}
