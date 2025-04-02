import { useEffect, useRef, useState } from 'react'

const TR_SELECTOR = 'table tr'
const FIXED_LEFT_SELECTOR = '.fixedLeft'
const FIXED_RIGHT_SELECTOR = '.fixedRight'

const HAS_FIXED_SELECTOR = `${TR_SELECTOR} ${FIXED_LEFT_SELECTOR},${TR_SELECTOR} ${FIXED_RIGHT_SELECTOR}`

export const useReelCells = () => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const currentRef = tableWrapperRef.current

    if (!currentRef) {
      return
    }

    let cellCleans: Array<() => void> = []
    const allClean = () => {
      cellCleans.forEach((clean) => clean())
      cellCleans = []
    }

    const handleScroll = () => {
      if (!currentRef.querySelector(HAS_FIXED_SELECTOR)) {
        return
      }

      let isVisible = false
      const commonAction = (
        cells: HTMLElement[] | NodeListOf<HTMLElement>,
        direction: 'left' | 'right',
        visible: boolean,
      ) => {
        allClean()

        const action = () => {
          let position = 0

          cells.forEach((cell, index) => {
            if (cell.classList.toggle('fixed', visible)) {
              isVisible = true
              cell.style[direction] = `${position}px`
              cell.style.zIndex = (index + 1).toString()

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

      currentRef.querySelectorAll<HTMLElement>(TR_SELECTOR).forEach((tr) => {
        const leftCells = tr.querySelectorAll<HTMLElement>(FIXED_LEFT_SELECTOR)
        const rightCells = Array.from(
          tr.querySelectorAll<HTMLElement>(FIXED_RIGHT_SELECTOR),
        ).reverse()

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
      })

      setShowShadow(isVisible)
    }

    handleScroll()
    currentRef.addEventListener('scroll', handleScroll)

    const observer = new ResizeObserver(handleScroll)

    observer.observe(currentRef)

    return () => {
      currentRef.removeEventListener('scroll', handleScroll)
      observer.unobserve(currentRef)
      allClean()
    }
  }, [])

  return { tableWrapperRef, showShadow }
}
