import { useEffect, useRef, useState } from 'react'

export const useReelCells = () => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const currentRef = tableWrapperRef.current

    if (!currentRef) {
      return () => undefined
    }

    const handleScroll = () => {
      const stickyCells = currentRef.querySelectorAll('.fixedElement') || []
      const scrollLeft = currentRef.scrollLeft
      const maxScrollLeft = currentRef.scrollWidth - currentRef.clientWidth || 0

      stickyCells.forEach((cell) => {
        const shouldFix = maxScrollLeft > 0 && scrollLeft < maxScrollLeft

        if (shouldFix) {
          cell.classList.add('fixed')
          setShowShadow(scrollLeft > 0)
        } else {
          cell.classList.remove('fixed')
          setShowShadow(maxScrollLeft === 0 && scrollLeft === 0 ? false : true)
        }
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
