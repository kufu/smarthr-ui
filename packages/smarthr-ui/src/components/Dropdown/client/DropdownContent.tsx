'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../../hooks/client/useTheme'
import { DropdownCloser } from '../DropdownCloser'

import { DropdownContext } from './Dropdown'
import { DROPDOWN_CONTENT_CLASS_NAME, DUMMY_FOCUS_CONTENT_CLASSNAME } from './constants'

const classNameGenerator = tv({
  base: [
    DROPDOWN_CONTENT_CLASS_NAME,
    'shr-absolute shr-z-overlap-base shr-overflow-y-auto shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3',
    'forced-colors:shr-outline forced-colors:shr-outline-1',
    'shr-invisible data-[dropdown-active]:shr-visible',
  ],
})

type BaseProps = PropsWithChildren<{
  /**
   * `true` のとき、ドロップダウン内のコンテンツをクリックしてもドロップダウンが閉じなくなる。。
   *  この場合は、 `DropdownCloser` を用いてドロップダウンを閉じることができる。
   */
  controllable?: boolean
}>

// HINT: onClickはroot divのクリックをドロップダウンを閉じる処理にdelegateしているため受け付けない。
// クリックハンドラが必要な場合はchildren側に要素をラップして設定する
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps | 'onClick'>

export const DropdownContent: FC<Props> = ({
  children,
  className,
  controllable = false,
  ...rest
}) => {
  const {
    isMountedContent,
    DropdownContentRoot,
    contentBox,
    contentCallbackRef,
    handleDelegateClickContentCloser,
  } = useContext(DropdownContext)
  const theme = useTheme()
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

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

  const styleAttr = {
    maxHeight: contentBox.maxHeight || undefined,
  }

  return (
    <DropdownContentRoot>
      <div
        {...rest}
        ref={contentCallbackRef}
        role="presentation"
        className={actualClassName}
        style={style}
        data-dropdown-active={isMountedContent || undefined}
        onClick={handleDelegateClickContentCloser}
      >
        {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
        <div tabIndex={-1} className={DUMMY_FOCUS_CONTENT_CLASSNAME} />
        {controllable ? (
          <div style={styleAttr}>{children}</div>
        ) : (
          <DropdownCloser className="shr-flex shr-flex-col" style={styleAttr}>
            {children}
          </DropdownCloser>
        )}
      </div>
    </DropdownContentRoot>
  )
}
