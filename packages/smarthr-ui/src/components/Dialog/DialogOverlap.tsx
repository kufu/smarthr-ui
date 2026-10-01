'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../hooks/client/useMergeRefs'
import { Center } from '../Layout'

type Props = PropsWithChildren<
  {
    isOpen: boolean
    as?: ComponentProps<typeof Center>['as']
  } & ComponentProps<'div'>
>

const classNameGenerator = tv({
  base: [
    'shr-fixed shr-inset-0 shr-z-overlap-base',
    '[&.shr-dialog-transition-enter]:shr-opacity-0',
    '[&.shr-dialog-transition-enter-active]:shr-transition-opacity',
    '[&.shr-dialog-transition-enter-active]:shr-duration-300',
    '[&.shr-dialog-transition-enter-active]:shr-ease-in-out',
    // enter と enter-active は同時に付与されるので、enter-active を強める
    '[&&.shr-dialog-transition-enter-active]:shr-opacity-100',
    '[&.shr-dialog-transition-exit]:shr-opacity-100',
    '[&.shr-dialog-transition-exit-active]:shr-transition-opacity',
    '[&.shr-dialog-transition-exit-active]:shr-duration-300',
    '[&.shr-dialog-transition-exit-active]:shr-ease-in-out',
    // exit と exit-active は同時に付与されるので、exit-active を強める
    '[&&.shr-dialog-transition-exit-active]:shr-opacity-0',
  ],
})

export const DialogOverlap: FC<Props> = ({ isOpen, className, children, as }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  // childrenをrefに保存（毎レンダリング時に最新の値を設定）
  const childrenRef = useRef(children)
  childrenRef.current = children
  const [childrenBuffer, setChildrenBuffer] = useState(children)

  const nodeRef = useRef<HTMLElement>(null)

  const callbackRef = useCallback((node: HTMLElement | null) => {
    if (!node) {
      return
    }

    const syncChildrenBuffer = () => {
      if (node.getAttribute('data-dialog-open') !== 'true') {
        setChildrenBuffer(childrenRef.current)
      }
    }

    // マウント時点のdata-dialog-open状態を反映
    syncChildrenBuffer()

    // MutationObserver で DOM の変更を監視
    const observer = new MutationObserver(syncChildrenBuffer)

    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-dialog-open'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const mergedRef = useMergeRefs(nodeRef, callbackRef)

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={300}
      unmountOnExit
      classNames="shr-dialog-transition"
    >
      <Center
        as={as}
        ref={mergedRef}
        verticalCentering
        className={actualClassName}
        data-dialog-open={isOpen || undefined}
      >
        {isOpen ? children : childrenBuffer}
      </Center>
    </CSSTransition>
  )
}
