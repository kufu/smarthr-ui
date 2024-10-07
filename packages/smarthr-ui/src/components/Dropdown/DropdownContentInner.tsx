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
  slots: {
    wrapper:
      'smarthr-ui-Dropdown-content shr-absolute shr-z-overlap-base shr-flex shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3',
    controllableWrapper: 'shr-flex shr-flex-col',
  },
  variants: {
    isActive: {
      true: {
        wrapper: 'shr-visible',
      },
      false: {
        wrapper: 'shr-invisible',
      },
    },
  },
})

type Props = PropsWithChildren<{
  triggerRect: Rect
  scrollable: boolean
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
  scrollable,
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

  const { wrapper, controllableWrapper } = useMemo(() => contentInner(), [])

  const wrapperStyleProps = useMemo(() => {
    const leftMargin = contentBox.left === undefined ? spacing[0.5] : `max(${contentBox.left}, 0px)`
    const rightMargin =
      contentBox.right === undefined ? spacing[0.5] : `max(${contentBox.right}, 0px)`
    const maxWidthStyle = `calc(100% - ${leftMargin} - ${rightMargin})`

    return {
      className: `${wrapper({ isActive, className })}`,
      style: {
        insetBlockStart: contentBox.top,
        insetInlineStart: contentBox.left || undefined,
        insetInlineEnd: contentBox.right || undefined,
        maxWidth: maxWidthStyle,
      },
    }
  }, [className, contentBox.left, contentBox.right, contentBox.top, isActive, spacing, wrapper])
  const controllableWrapperStyleProps = useMemo(
    () => ({
      className: controllableWrapper(),
      style: {
        maxHeight: contentBox.maxHeight && scrollable ? contentBox.maxHeight : 'initial',
      },
    }),
    [contentBox.maxHeight, scrollable, controllableWrapper],
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
