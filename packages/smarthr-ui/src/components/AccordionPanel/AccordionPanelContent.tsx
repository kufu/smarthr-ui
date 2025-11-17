'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
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

const classNameGenerator = tv({
  base: [
    'smarthr-ui-AccordionPanel-content',
    'shr-invisible shr-max-h-0 shr-opacity-0 shr-transition-[max-height,_visible,_opacity] shr-duration-150 shr-ease-in-out',
    '[&.entered]:shr-visible [&.entered]:shr-max-h-[revert] [&.entered]:shr-opacity-100',
    // HINT: flexなどで囲まれると、非表示だが内容分高さが出てしまい、スクロール領域が不自然に伸びてしまう現象が起きる場合がある
    // 非表示の場合、visually hiddenを適用することで、内容としては残しつつ、高さを0にすることで回避する
    'aria-[hidden]:shr-overflow-hidden aria-[hidden]:shr-absolute aria-[hidden]:shr-h-px',
  ],
})

export const AccordionPanelContent: FC<Props & ElementProps> = ({ className, ...props }) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const visible = useMemo(() => getIsInclude(expandedItems, name), [expandedItems, name])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Transition in={visible} timeout={150} nodeRef={wrapperRef}>
      {(status) => (
        <div
          {...props}
          ref={wrapperRef}
          id={`${name}-content`}
          aria-labelledby={`${name}-trigger`}
          aria-hidden={visible ? undefined : true}
          className={`${actualClassName} ${status}`}
        />
      )}
    </Transition>
  )
}
