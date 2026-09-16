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

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { TableScroller } from '../TableScroller'
import { reelShadowClassNameGenerator } from '../reelShadowStyle'

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

  const frame = useAnimationFrame()

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback(
      (node: HTMLElement | null) => {
        if (!node) {
          return
        }

        const handleScroll = () => {
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

        // HINT: handleScrollは監視対象セルのstyle/classを書き換える。これをResizeObserverの
        //       コールバックから同期的に呼ぶと、同一配信サイクル内で通知が積み上がり
        //       「ResizeObserver loop completed with undelivered notifications」を発生させる。
        //       frame.requestで次フレームに逃がし、フレーム内の複数通知をコアレスする。
        const scheduleHandleScroll = () => frame.request(handleScroll)

        // HINT: cellObserverでのobserveをhandleScroll内で毎回やり直すと、observe自体が次フレームに
        //       初回通知を発火させ、handleScroll→observe→通知→handleScroll…と毎フレーム回り続ける。
        //       observeの張り直しは監視対象セルが変わるDOM構造変更時(mutationObserver)とmount時だけに限定し、
        //       handleScroll(計測・style適用)から分離する。
        const cellObserver = new ResizeObserver(scheduleHandleScroll)
        const observeCells = () => {
          cellObserver.disconnect()
          node
            .querySelectorAll<HTMLElement>(HAS_FIXED_SELECTOR)
            .forEach((cell) => cellObserver.observe(cell))
        }

        observeCells()
        handleScroll()
        node.addEventListener('scroll', scheduleHandleScroll, { passive: true })

        const resizeObserver = new ResizeObserver(scheduleHandleScroll)
        resizeObserver.observe(node)

        // HINT: Paginationと組み合わせた際などにテーブル構造の変更を検知して監視対象を張り直す
        const mutationObserver = new MutationObserver(() => {
          observeCells()
          scheduleHandleScroll()
        })
        mutationObserver.observe(node, {
          childList: true,
          subtree: true,
        })

        return () => {
          node.removeEventListener('scroll', scheduleHandleScroll)
          resizeObserver.disconnect()
          mutationObserver.disconnect()
          cellObserver.disconnect()
          frame.cancel()
        }
      },
      [frame],
    ),
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
