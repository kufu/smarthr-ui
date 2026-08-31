'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { TableScroller } from './TableScroller'
import { reelShadowClassNameGenerator } from './reelShadowStyle'

const TR_SELECTOR = 'table tr'
const FIXED_LEFT_SELECTOR = '[data-fixed="left"]'
const FIXED_RIGHT_SELECTOR = '[data-fixed="right"]'

const HAS_FIXED_SELECTOR = `${TR_SELECTOR} ${FIXED_LEFT_SELECTOR},${TR_SELECTOR} ${FIXED_RIGHT_SELECTOR}`

type Props = PropsWithChildren &
  Omit<ComponentPropsWithRef<'div'>, keyof PropsWithChildren> & {
    fixedHead?: boolean
  }

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-TableReel', 'shr-relative'],
    inner: ['smarthr-ui-TableReel-inner', 'shr-relative'],
  },
})

export const TableReel: FC<Props> = ({ className, children, fixedHead, ...rest }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const wrapper = wrapperRef.current

    if (!wrapper) {
      return
    }

    const handleScroll = () => {
      cellObserver.disconnect()

      if (!wrapper.querySelector(HAS_FIXED_SELECTOR)) {
        setShowShadow(false)
        return
      }

      let isVisible = false
      const commonAction = (
        cells: HTMLElement[] | NodeListOf<HTMLElement>,
        direction: 'left' | 'right',
        visible: boolean,
      ) => {
        let position = 0

        cells.forEach((cell, index) => {
          if (cell.classList.toggle('fixed', visible)) {
            isVisible = true
            cell.style[direction] = `${position}px`
            cell.style.zIndex = (index + 1).toString()

            position += cell.offsetWidth
          }

          cellObserver.observe(cell)
        })
      }

      wrapper.querySelectorAll<HTMLElement>(TR_SELECTOR).forEach((tr) => {
        const leftCells = tr.querySelectorAll<HTMLElement>(FIXED_LEFT_SELECTOR)
        const rightCells = tr.querySelectorAll<HTMLElement>(FIXED_RIGHT_SELECTOR)

        if (leftCells.length > 0) {
          commonAction(leftCells, 'left' as const, wrapper.scrollLeft > 0)
        }

        if (rightCells.length > 0) {
          commonAction(
            Array.from(rightCells).reverse(),
            'right' as const,
            wrapper.scrollLeft < wrapper.scrollWidth - wrapper.clientWidth - 1,
          )
        }
      })

      setShowShadow(isVisible)
    }

    // HINT: cellObserverはhandleScroll先頭でdisconnect→再observeするため、
    //       wrapperを監視するresizeObserverとは分けている
    const cellObserver = new ResizeObserver(handleScroll)

    handleScroll()
    wrapper.addEventListener('scroll', handleScroll, { passive: true })

    const resizeObserver = new ResizeObserver(handleScroll)
    resizeObserver.observe(wrapper)

    // HINT: Paginationと組み合わせた際などにテーブル構造の変更を検知して再生成
    const mutationObserver = new MutationObserver(handleScroll)
    mutationObserver.observe(wrapper, {
      childList: true,
      subtree: true,
    })

    return () => {
      wrapper.removeEventListener('scroll', handleScroll)
      resizeObserver.unobserve(wrapper)
      mutationObserver.disconnect()
      cellObserver.disconnect()
    }
  }, [wrapperRef])

  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return {
      wrapper: reelShadowClassNameGenerator({ showShadow, className: wrapper({ className }) }),
      inner: inner(),
    }
  }, [showShadow, className])

  return (
    <TableScroller ref={wrapperRef} fixedHead={fixedHead}>
      <div className={classNames.wrapper}>
        <div {...rest} className={classNames.inner}>
          {children}
        </div>
      </div>
    </TableScroller>
  )
}
