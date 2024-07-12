import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

type Props = PropsWithChildren<{
  isOpen: boolean
}>

const dialogOverlap = tv({
  base: [
    'shr-absolute',
    'shr-z-overlap-base',
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

export const DialogOverlap: FC<Props> = ({ isOpen, children }) => {
  const styles = useMemo(() => dialogOverlap(), [])
  const [childrenBuffer, setChildrenBuffer] = useState<ReactNode>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setChildrenBuffer(children)
    }
  }, [isOpen, children])

  return (
    <CSSTransition
      classNames="shr-dialog-transition"
      in={isOpen}
      timeout={300}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div ref={nodeRef} className={styles}>
        {isOpen ? children : childrenBuffer}
      </div>
    </CSSTransition>
  )
}
