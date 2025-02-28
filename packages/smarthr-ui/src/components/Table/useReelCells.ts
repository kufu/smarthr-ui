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
      const stickyCells = currentRef.querySelectorAll('.fixedElement')

      if (!stickyCells) {
        return
      }

      const scrollLeft = currentRef.scrollLeft
      const maxScrollLeft = currentRef.scrollWidth - currentRef.clientWidth || 0
      const shouldFix = maxScrollLeft > 0 && scrollLeft < maxScrollLeft
      const settableShowShadow = shouldFix
        ? scrollLeft > 0
        : maxScrollLeft !== 0 || scrollLeft !== 0

      stickyCells.forEach((cell) => {
        cell.classList.toggle('fixed', shouldFix)
        setShowShadow(settableShowShadow)
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
  }, [tableWrapperRef, setShowShadow])

  return { tableWrapperRef, showShadow }
}
