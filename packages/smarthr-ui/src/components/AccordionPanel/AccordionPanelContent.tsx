'use client'

import React, {
  ComponentPropsWithoutRef,
  FC,
  PropsWithChildren,
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
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const accordionPanelContent = tv({
  base: [
    'smarthr-ui-AccordionPanel-content',
    'shr-max-h-0 shr-transition-[max-height,_visible,_opacity] shr-duration-150 shr-ease-in-out shr-invisible shr-opacity-0',
    '[&.entered]:shr-max-h-[revert] [&.entered]:shr-visible [&.entered]:shr-opacity-100',
  ],
})

export const AccordionPanelContent: FC<Props & ElementProps> = ({ className, ...props }) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const isInclude = getIsInclude(expandedItems, name)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const styles = useMemo(() => accordionPanelContent({ className }), [className])

  return (
    <Transition in={isInclude} timeout={150} nodeRef={wrapperRef}>
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
