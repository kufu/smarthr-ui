import { useEffect, useRef, useState } from 'react'

export const useReelCells = () => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const currentRef = tableWrapperRef.current

    if (!currentRef) {
      return
    }

    const handleScroll = () => {
      const stickyCells = currentRef.querySelectorAll('.fixedLeft,.fixedRight')

      if (!stickyCells) {
        return
      }

      const leftFix = currentRef.scrollLeft > 0
      const rightFix = currentRef.scrollLeft < currentRef.scrollWidth - currentRef.clientWidth - 1

      stickyCells.forEach((cell) => {
        setShowShadow(
          cell.classList.toggle('fixed', cell.matches('.fixedLeft') ? leftFix : rightFix),
        )
      })
    }

    handleScroll()
    currentRef.addEventListener('scroll', handleScroll)

    const observer = new window.ResizeObserver(handleScroll)

    observer.observe(currentRef)

    return () => {
      currentRef.removeEventListener('scroll', handleScroll)
      observer.unobserve(currentRef)
    }
  }, [])

  return { tableWrapperRef, showShadow }
}
