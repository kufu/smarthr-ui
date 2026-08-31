'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useCallbackRefCleanupForReact18 } from '../../../../hooks/client/useCallbackRefCleanupForReact18'
import { TableScroller } from '../../TableScroller'
import { reelShadowClassNameGenerator } from '../../reelShadowStyle'

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
  // TODO: stateではなくdata属性などを直接変更することで再レンダリングを引き起こさない形にしたい
  const [showShadow, setShowShadow] = useState(false)

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const handleScroll = () => {
        cellObserver.disconnect()

        if (!node.querySelector(HAS_FIXED_SELECTOR)) {
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

        node.querySelectorAll<HTMLElement>(TR_SELECTOR).forEach((tr) => {
          const leftCells = tr.querySelectorAll<HTMLElement>(FIXED_LEFT_SELECTOR)
          const rightCells = tr.querySelectorAll<HTMLElement>(FIXED_RIGHT_SELECTOR)

          if (leftCells.length > 0) {
            commonAction(leftCells, 'left' as const, node.scrollLeft > 0)
          }

          if (rightCells.length > 0) {
            commonAction(
              Array.from(rightCells).reverse(),
              'right' as const,
              node.scrollLeft < node.scrollWidth - node.clientWidth - 1,
            )
          }
        })

        setShowShadow(isVisible)
      }

      // HINT: cellObserverはhandleScroll先頭でdisconnect→再observeするため、
      //       nodeを監視するresizeObserverとは分けている
      const cellObserver = new ResizeObserver(handleScroll)

      handleScroll()
      node.addEventListener('scroll', handleScroll, { passive: true })

      const resizeObserver = new ResizeObserver(handleScroll)
      resizeObserver.observe(node)

      // HINT: Paginationと組み合わせた際などにテーブル構造の変更を検知して再生成
      const mutationObserver = new MutationObserver(handleScroll)
      mutationObserver.observe(node, {
        childList: true,
        subtree: true,
      })

      return () => {
        node.removeEventListener('scroll', handleScroll)
        resizeObserver.unobserve(node)
        mutationObserver.disconnect()
        cellObserver.disconnect()
      }
    }, []),
  )

  const classNames = useMemo(() => {
    const { wrapper, inner } = classNameGenerator()

    return {
      wrapper: reelShadowClassNameGenerator({ showShadow, className: wrapper({ className }) }),
      inner: inner(),
    }
  }, [showShadow, className])

  return (
    <TableScroller ref={callbackRef} fixedHead={fixedHead}>
      <div className={classNames.wrapper}>
        <div {...rest} className={classNames.inner}>
          {children}
        </div>
      </div>
    </TableScroller>
  )
}
