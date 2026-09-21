'use client'

import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLayoutEffectRef } from '../../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useTheme } from '../../../../hooks/client/useTheme'
import { DropdownCloser } from '../../DropdownCloser'
import { DropdownContext } from '../Dropdown'
import { DROPDOWN_CONTENT_CLASS_NAME, DUMMY_FOCUS_CONTENT_CLASSNAME } from '../constants'

import { getContentBoxStyle } from './getContentBoxStyle'

const classNameGenerator = tv({
  base: [
    DROPDOWN_CONTENT_CLASS_NAME,
    'shr-absolute shr-z-overlap-base shr-overflow-y-auto shr-break-words shr-rounded-m shr-bg-white shr-shadow-layer-3',
    'forced-colors:shr-outline forced-colors:shr-outline-1',
    'shr-invisible data-[dropdown-mounted]:shr-visible',
  ],
})

const INITIAL_STYLES: {
  wrapper: {
    insetBlockStart: string
    insetInlineStart?: string
    insetInlineEnd?: string
    maxWidth: string
  }
  body: {
    maxHeight?: string
  }
} = { wrapper: { insetBlockStart: 'auto', maxWidth: '' }, body: {} }

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
  const theme = useTheme()
  // TODO: triggerRectの変化によってのみstylesは変化する
  // triggerRectはstyles生成のためだけにしか利用されていない
  // 後続のlayoutEffectと併せて整理する
  const [styles, setStyles] = useState(INITIAL_STYLES)
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  const { DropdownContentRoot, triggerRect, contentCallbackRef, handleDelegateClickContentCloser } =
    useContext(DropdownContext)

  const layoutEffectRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const contentBox = getContentBoxStyle(
        triggerRect,
        {
          width: node.offsetWidth,
          height: node.offsetHeight,
        },
        {
          width: document.body.clientWidth,
          height: innerHeight,
        },
        {
          top: scrollY,
          left: scrollX,
        },
      )
      const defaultMargin = theme.spacingByChar(0.5)
      const leftMargin =
        contentBox.left === undefined ? defaultMargin : `max(${contentBox.left}, 0px)`
      const rightMargin =
        contentBox.right === undefined ? defaultMargin : `max(${contentBox.right}, 0px)`
      const maxWidthStyle = `calc(100% - ${leftMargin} - ${rightMargin})`

      setStyles((current) => {
        const wrapper = {
          insetBlockStart: contentBox.top,
          insetInlineStart: contentBox.left || undefined,
          insetInlineEnd: contentBox.right || undefined,
          maxWidth: maxWidthStyle,
        }
        const body = {
          maxHeight: contentBox.maxHeight || undefined,
        }

        if (
          current.wrapper.insetBlockStart === wrapper.insetBlockStart &&
          current.wrapper.insetInlineStart === wrapper.insetInlineStart &&
          current.wrapper.insetInlineEnd === wrapper.insetInlineEnd &&
          current.wrapper.maxWidth === wrapper.maxWidth &&
          current.body.maxHeight === body.maxHeight
        ) {
          return current
        }

        return {
          wrapper,
          body,
        }
      })

      const dropdownMountedAttr = 'data-dropdown-mounted'

      if (!node.getAttribute(dropdownMountedAttr) !== 'true') {
        node.setAttribute(dropdownMountedAttr, 'true')
        // HINT: このコンポーネントは Dropdown が開かれた時のみマウントされるが、マウント直後は
        // 位置計算が完了していないためコンテンツが誤った位置にちらつくのを防ぐために
        // shr-invisible (visibility: hidden) でレンダリングされ、visibility: hidden の要素は
        // フォーカスを受け付けない。data-dropdown-mounted の設定直後直後に focus() を呼ぶようにする
        node.querySelector<HTMLElement>(`.${DUMMY_FOCUS_CONTENT_CLASSNAME}`)?.focus()
      }
    },
    [triggerRect, theme],
  )

  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const mergedRef = useMergeRefs(contentCallbackRef, layoutEffectRef)

  return (
    <DropdownContentRoot>
      <div
        {...rest}
        ref={mergedRef}
        role="presentation"
        className={actualClassName}
        style={styles.wrapper}
        onClick={handleDelegateClickContentCloser}
      >
        {/* eslint-disable-next-line smarthr/a11y-scroller-has-tabindex -- dummy element for focus management. */}
        <div tabIndex={-1} className={DUMMY_FOCUS_CONTENT_CLASSNAME} />
        {controllable ? (
          <div style={styles.body}>{children}</div>
        ) : (
          <DropdownCloser className="shr-flex shr-flex-col" style={styles.body}>
            {children}
          </DropdownCloser>
        )}
      </div>
    </DropdownContentRoot>
  )
}
