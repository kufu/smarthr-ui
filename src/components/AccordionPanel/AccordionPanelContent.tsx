import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { Transition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

import { getIsInclude } from '../../libs/map'

import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'

type Props = PropsWithChildren
type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof Props>

const duration = 100

const accordionPanelContent = tv({
  base: [
    'smarthr-ui-AccordionPanel-content',
    'shr-h-0',
    'shr-overflow-hidden',
    'shr-transition-[height]',
    'shr-duration-100',
    'shr-ease-in-out',
    'shr-invisible',
    '[&.entered]:shr-h-auto',
    '[&.entered]:shr-overflow-visible',
    '[&.entered]:shr-visible',
  ],
})

export const AccordionPanelContent: FC<Props & ElementProps> = ({ className, ...props }) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const isInclude = getIsInclude(expandedItems, name)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const styles = useMemo(() => accordionPanelContent({ className }), [className])

  const recalculateHeight = useCallback(
    (node: HTMLElement) => {
      const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
      node.style.height = `${wrapperHeight}px`
    },
    [wrapperRef],
  )

  const handleEntered = (node: HTMLElement) => {
    node.style.height = 'auto'
    node.style.visibility = 'visible'
  }

  const handleExited = (node: HTMLElement) => {
    node.style.height = '0px'
    node.style.visibility = 'hidden'
  }

  return (
    <Transition
      in={isInclude}
      onEntering={recalculateHeight}
      onEntered={handleEntered}
      onExit={recalculateHeight}
      onExiting={recalculateHeight}
      onExited={handleExited}
      timeout={duration}
    >
      {(status) => (
        <div
          {...props}
          id={`${name}-content`}
          className={`${styles} ${status}`}
          aria-labelledby={`${name}-trigger`}
          aria-hidden={!isInclude}
          ref={wrapperRef}
        />
      )}
    </Transition>
  )
}
