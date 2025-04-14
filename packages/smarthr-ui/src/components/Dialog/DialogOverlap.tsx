import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

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
  const [childrenBuffer, setChildrenBuffer] = useState<ReactNode>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  useEffect(() => {
    if (isOpen) {
      setChildrenBuffer(children)
    }
  }, [isOpen, children])

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={isOpen}
      timeout={300}
      unmountOnExit
      classNames="shr-dialog-transition"
    >
      <Center ref={nodeRef} verticalCentering className={actualClassName} as={as}>
        {isOpen ? children : childrenBuffer}
      </Center>
    </CSSTransition>
  )
}
