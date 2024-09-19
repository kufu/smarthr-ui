import { useEffect, useRef, useState } from 'react'

export const useReelCells = () => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const currentRef = tableWrapperRef.current

    const handleScroll = () => {
      if (!currentRef) {
        return
      }
      const stickyCells =
        (currentRef.querySelectorAll(
          '.smarthr-ui-TableCell-fixed',
        ) as unknown as HTMLCollectionOf<HTMLElement>) || []
      for (const stickyCell of stickyCells) {
        const prevWidth = stickyCell.previousElementSibling?.getBoundingClientRect().width ?? 0
        const nextWidth = stickyCell.nextElementSibling?.getBoundingClientRect().width ?? 0
        stickyCell.style.setProperty('--prev-width', `${prevWidth}px`)
        stickyCell.style.setProperty('--next-width', `${nextWidth}px`)
      }

      const scrollLeft = currentRef.scrollLeft
      const maxScrollLeft = currentRef.scrollWidth - currentRef.clientWidth || 0

      const scrollReachedStart = scrollLeft <= 0
      const scrollReachedEnd = maxScrollLeft <= 0 || scrollLeft >= maxScrollLeft

      currentRef.classList.toggle('smarthr-ui-TableReel-scroll-reached-start', scrollReachedStart)
      currentRef.classList.toggle('smarthr-ui-TableReel-scroll-reached-end', scrollReachedEnd)
    }
    handleScroll()

    currentRef?.addEventListener('scroll', handleScroll)

    const observer = new window.ResizeObserver(() => {
      handleScroll()
    })
    currentRef && observer.observe(currentRef)

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll)
      currentRef && observer.unobserve(currentRef)
    }
  }, [tableWrapperRef, setShowShadow])

  return { tableWrapperRef, showShadow }
}
