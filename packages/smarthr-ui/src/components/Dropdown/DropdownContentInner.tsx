'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'

import { DropdownCloser } from './DropdownCloser'
import { type ContentBoxStyle, type Rect, getContentBoxStyle } from './dropdownHelper'
import { useKeyboardNavigation } from './useKeyboardNavigation'

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown-content shr-absolute shr-z-overlap-base shr-overflow-y-auto shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3',
  variants: {
    isActive: {
      true: 'shr-visible',
      false: 'shr-invisible',
    },
  },
})

type AbstractProps = PropsWithChildren<{
  triggerRect: Rect
  controllable: boolean
}>

export type ElementProps = Omit<ComponentProps<'div'>, keyof AbstractProps>
type Props = AbstractProps & ElementProps

type DropdownContentInnerContextType = {
  maxHeight: string
}

export const DropdownContentInnerContext = createContext<DropdownContentInnerContextType>({
  maxHeight: '',
})

export const DropdownContentInner: FC<Props> = ({
  triggerRect,
  children,
  className,
  controllable,
  ...rest
}) => {
  const theme = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [contentBox, setContentBox] = useState<ContentBoxStyle>({
    top: 'auto',
    maxHeight: '',
  })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const focusTargetRef = useRef<HTMLDivElement>(null)

  const actualClassName = useMemo(
    () => classNameGenerator({ isActive, className }),
    [isActive, className],
  )

  const style = (() => {
    const defaultMargin = theme.spacingByChar(0.5)
    const leftMargin =
      contentBox.left === undefined ? defaultMargin : `max(${contentBox.left}, 0px)`
    const rightMargin =
      contentBox.right === undefined ? defaultMargin : `max(${contentBox.right}, 0px)`
    const maxWidthStyle = `calc(100% - ${leftMargin} - ${rightMargin})`

    return {
      insetBlockStart: contentBox.top,
      insetInlineStart: contentBox.left || undefined,
      insetInlineEnd: contentBox.right || undefined,
      maxWidth: maxWidthStyle,
    }
  })()

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

  // setIsActive(true) と同じ useEffect 内で直接 focus() を呼ぶことはできない。
  // このコンポーネントは Dropdown が開かれた時のみマウントされるが、マウント直後は
  // 位置計算が完了していないためコンテンツが誤った位置にちらつくのを防ぐために
  // shr-invisible (visibility: hidden) でレンダリングされる。
  // ちらつき防止には実寸法を保持したまま視覚的に隠せる visibility: hidden が唯一の手段となる。
  // visibility: hidden の要素はフォーカスを受け付けないため、setIsActive(true) の直後に
  // focus() を呼んでも DOM がまだ更新されておらず無効になる。
  //
  // useEffect([isActive]) であれば、isActive=true になった後の render commit 後に
  // 必ず実行されることが保証されるため、この実装が最も信頼性が高い。
  useEffect(() => {
    if (isActive) {
      focusTargetRef.current?.focus()
    }
  }, [isActive])

  useKeyboardNavigation(wrapperRef, focusTargetRef)

  return (
    <div {...rest} ref={wrapperRef} className={actualClassName} style={style}>
      {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
      <div ref={focusTargetRef} tabIndex={-1} />
      {controllable ? (
        <div
          style={{
            maxHeight: contentBox.maxHeight || undefined,
          }}
        >
          {children}
        </div>
      ) : (
        <DropdownContentInnerContext.Provider value={{ maxHeight: contentBox.maxHeight }}>
          <DropdownCloser>{children}</DropdownCloser>
        </DropdownContentInnerContext.Provider>
      )}
    </div>
  )
}
