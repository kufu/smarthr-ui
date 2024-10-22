import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { spacing } from '../../themes'

import { DropdownCloser } from './DropdownCloser'
import { ContentBoxStyle, Rect, getContentBoxStyle } from './dropdownHelper'
import { useKeyboardNavigation } from './useKeyboardNavigation'

const contentInner = tv({
  base: 'smarthr-ui-Dropdown-content shr-absolute shr-z-overlap-base shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3 shr-overflow-y-auto',
  variants: {
    isActive: {
      true: 'shr-visible',
      false: 'shr-invisible',
    },
  },
})

type Props = PropsWithChildren<{
  triggerRect: Rect
  controllable: boolean
}>

export type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

type DropdownContentInnerContextType = {
  maxHeight: string
}

export const DropdownContentInnerContext = createContext<DropdownContentInnerContextType>({
  maxHeight: '',
})

export const DropdownContentInner: FC<Props & ElementProps> = ({
  triggerRect,
  children,
  className,
  controllable,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: 'auto',
    maxHeight: '',
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

  const wrapperStyleProps = useMemo(() => {
    const leftMargin = contentBox.left === undefined ? spacing[0.5] : `max(${contentBox.left}, 0px)`
    const rightMargin =
      contentBox.right === undefined ? spacing[0.5] : `max(${contentBox.right}, 0px)`
    const maxWidthStyle = `calc(100% - ${leftMargin} - ${rightMargin})`

    return {
      className: contentInner({ isActive, className }),
      style: {
        insetBlockStart: contentBox.top,
        insetInlineStart: contentBox.left || undefined,
        insetInlineEnd: contentBox.right || undefined,
        maxWidth: maxWidthStyle,
      },
    }
  }, [className, contentBox.left, contentBox.right, contentBox.top, isActive])
  const controllableWrapperStyleProps = useMemo(
    () => ({
      style: {
        maxHeight: contentBox.maxHeight || undefined,
      },
    }),
    [contentBox.maxHeight],
  )

  useEffect(() => {
    if (wrapperRef.current) {
      setContentBox(
        getContentBoxStyle(
          triggerRect,
          {
            width: wrapperRef.current.offsetWidth,
            height: wrapperRef.current.offsetHeight,
          },
          {
            width: document.body.clientWidth,
            height: innerHeight,
          },
          {
            top: scrollY,
            left: scrollX,
          },
        ),
      )
      setIsActive(true)
    }
  }, [triggerRect])

  useEffect(() => {
    if (isActive) {
      focusTargetRef.current?.focus()
    }
  }, [isActive])

  useKeyboardNavigation(wrapperRef, focusTargetRef)

  return (
    <div {...props} {...wrapperStyleProps} ref={wrapperRef}>
      {/* dummy element for focus management. */}
      <div tabIndex={-1} ref={focusTargetRef} />
      {controllable ? (
        <div {...controllableWrapperStyleProps}>{children}</div>
      ) : (
        <DropdownContentInnerContext.Provider value={{ maxHeight: contentBox.maxHeight }}>
          <DropdownCloser>{children}</DropdownCloser>
        </DropdownContentInnerContext.Provider>
      )}
    </div>
  )
}
