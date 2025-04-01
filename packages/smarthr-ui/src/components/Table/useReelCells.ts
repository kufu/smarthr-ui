import { useEffect, useRef, useState } from 'react'

export const useReelCells = () => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const currentRef = tableWrapperRef.current

    if (!currentRef) {
      return
    }

    const cellCleans: Array<() => void> = []

    const handleScroll = () => {
      const leftCells = currentRef.querySelectorAll<HTMLElement>('.fixedLeft')
      const tempRightCells = currentRef.querySelectorAll<HTMLElement>('.fixedRight')

      if (!leftCells && !tempRightCells) {
        return
      }

      const rightCells = Array.from(tempRightCells).reverse()

      let isVisible = false

      const commonAction = (
        cells: HTMLElement[] | NodeListOf<HTMLElement>,
        direction: 'left' | 'right',
        visible: boolean,
      ) => {
        const action = () => {
          let position = 0

          cells.forEach((cell, index) => {
            if (cell.classList.toggle('fixed', visible)) {
              isVisible = true
              cell.style[direction] = `${position}px`
              cell.style.zIndex = index.toString()

              position += cell.offsetWidth
            }
          })
        }

        action()

        const observer = new ResizeObserver(action)

        cells.forEach((cell) => {
          observer.observe(cell)
        })

        cellCleans.push(() => {
          cells.forEach((cell) => {
            observer.unobserve(cell)
          })
        })
      }

      if (leftCells.length > 0) {
        commonAction(leftCells, 'left' as const, currentRef.scrollLeft > 0)
      }

      if (rightCells.length > 0) {
        commonAction(
          rightCells,
          'right' as const,
          currentRef.scrollLeft < currentRef.scrollWidth - currentRef.clientWidth - 1,
        )
      }

      setShowShadow(isVisible)
    }

    handleScroll()
    currentRef.addEventListener('scroll', handleScroll)

    const observer = new ResizeObserver(handleScroll)

    observer.observe(currentRef)

    return () => {
      currentRef.removeEventListener('scroll', handleScroll)
      observer.unobserve(currentRef)
      cellCleans.forEach((action) => action())
    }
  }, [])

  return { tableWrapperRef, showShadow }
}
