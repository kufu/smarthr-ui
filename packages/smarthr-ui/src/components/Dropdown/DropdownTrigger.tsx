'use client'

import {
  Children,
  type ComponentProps,
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { tabbable } from '../../libs/tabbable'
import { includeDisabledTrigger } from '../../libs/util'
import { Tooltip } from '../Tooltip'

import { DropdownContext } from './Dropdown'

type ConditionalWrapperProps = {
  shouldWrapContent?: boolean
  wrapper: FC<PropsWithChildren>
}

/**
 * 条件付きでラッパをレンダリングする
 */
const ConditionalWrapper: FC<PropsWithChildren<ConditionalWrapperProps>> = ({
  shouldWrapContent,
  wrapper,
  children,
}) => (shouldWrapContent ? wrapper({ children }) : children)

type Props = PropsWithChildren<ComponentProps<'div'>> & {
  tooltip?: { message: ReactNode; show?: boolean }
}

const wrapper = tv({
  base: 'smarthr-ui-Dropdown shr-inline-block',
})

export const DropdownTrigger: FC<Props> = ({ children, className, tooltip }) => {
  const { active, onClickTrigger, contentId, triggerElementRef } = useContext(DropdownContext)
  const styles = useMemo(() => wrapper({ className }), [className])

  useEffect(() => {
    if (!triggerElementRef.current) {
      return
    }

    // apply ARIA to all focusable elements in trigger
    const triggers = tabbable(triggerElementRef.current, { shouldIgnoreVisibility: true })

    triggers.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', active.toString())
      trigger.setAttribute('aria-controls', contentId)
    })
  }, [triggerElementRef, active, contentId])

  let foundFirstElement = false

  return (
    <div ref={triggerElementRef} className={styles}>
      <ConditionalWrapper
        shouldWrapContent={tooltip?.show}
        wrapper={({ children: currentChildren }) => (
          <Tooltip
            message={tooltip?.message}
            horizontal="auto"
            vertical="auto"
            triggerType="icon"
            tabIndex={-1}
          >
            {currentChildren}
          </Tooltip>
        )}
      >
        {/* 引き金となる要素が disabled な場合、処理を差し込む必要がないため、そのまま出力する */}
        {includeDisabledTrigger(children)
          ? children
          : Children.map(children, (child) => {
              if (foundFirstElement || !isValidElement(child)) {
                return child
              }

              foundFirstElement = true

              return cloneElement(child as ReactElement, {
                onClick: (e: MouseEvent) => {
                  onClickTrigger(e.currentTarget.getBoundingClientRect())

                  child.props.onClick?.(e)
                },
              })
            })}
      </ConditionalWrapper>
    </div>
  )
}
