'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownCloser } from '../../DropdownCloser'
import { DropdownContext } from '../Dropdown'
import { DROPDOWN_CONTENT_CLASS_NAME, DUMMY_FOCUS_CONTENT_CLASSNAME } from '../constants'

const classNameGenerator = tv({
  base: [
    DROPDOWN_CONTENT_CLASS_NAME,
    'shr-absolute shr-z-overlap-base shr-overflow-y-auto shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3',
    'forced-colors:shr-outline forced-colors:shr-outline-1',
    'shr-invisible data-[dropdown-mounted]:shr-visible',
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
type Props = BaseProps &
  Omit<ComponentProps<'div'>, keyof BaseProps | 'onClick' | 'data-dropdown-mounted'>

export const DropdownContent: FC<Props> = ({
  children,
  className,
  controllable = false,
  ...rest
}) => {
  const {
    DropdownContentRoot,
    contentStyles,
    contentCallbackRef,
    handleDelegateClickContentCloser,
  } = useContext(DropdownContext)

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <DropdownContentRoot>
      <div
        {...rest}
        ref={contentCallbackRef}
        role="presentation"
        className={actualClassName}
        style={contentStyles.wrapper}
        onClick={handleDelegateClickContentCloser}
      >
        {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
        <div tabIndex={-1} className={DUMMY_FOCUS_CONTENT_CLASSNAME} />
        {controllable ? (
          <div style={contentStyles.body}>{children}</div>
        ) : (
          <DropdownCloser className="shr-flex shr-flex-col" style={contentStyles.body}>
            {children}
          </DropdownCloser>
        )}
      </div>
    </DropdownContentRoot>
  )
}
