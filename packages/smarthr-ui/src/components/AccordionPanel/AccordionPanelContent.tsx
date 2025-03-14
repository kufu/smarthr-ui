'use client'

import React, {
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
import { visuallyHiddenTextClassNameGenerator } from '../VisuallyHiddenText'

import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'

type Props = PropsWithChildren
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-AccordionPanel-content',
    'shr-max-h-0 shr-transition-[max-height,_visible,_opacity] shr-duration-150 shr-ease-in-out shr-invisible shr-opacity-0',
    '[&.entered]:shr-max-h-[revert] [&.entered]:shr-visible [&.entered]:shr-opacity-100',
  ],
})

export const AccordionPanelContent: FC<Props & ElementProps> = ({ className, ...props }) => {
  const { name } = useContext(AccordionPanelItemContext)
  const { expandedItems } = useContext(AccordionPanelContext)
  const isInclude = useMemo(() => getIsInclude(expandedItems, name), [expandedItems, name])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const classNames = useMemo(
    () => ({
      base: classNameGenerator({ className }),
      visallyHidden: visuallyHiddenTextClassNameGenerator(),
    }),
    [className],
  )

  return (
    <Transition in={isInclude} timeout={150} nodeRef={wrapperRef}>
      {(status) => (
        <div
          {...props}
          ref={wrapperRef}
          id={`${name}-content`}
          aria-labelledby={`${name}-trigger`}
          aria-hidden={!isInclude}
          // HINT: flexなどで囲まれると、非表示だが内容分高さが出てしまい、スクロール領域が不自然に伸びてしまう現象が起きる場合がある
          // 非表示の場合、visually hiddenを適用することで、内容としては残しつつ、高さを0にすることで回避する
          className={`${classNames.base} ${status} ${isInclude ? '' : classNames.visallyHidden}`}
        />
      )}
    </Transition>
  )
}
