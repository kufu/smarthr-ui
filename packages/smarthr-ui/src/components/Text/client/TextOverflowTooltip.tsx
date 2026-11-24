'use client'

import {
  type ElementType,
  type FC,
  type FocusEvent,
  type PointerEvent,
  type TouchEvent,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { TooltipPortal } from '../../Tooltip'

import type { ExtendElementPropsWithRef } from '../../../types'

type Props = ExtendElementPropsWithRef<
  'span',
  {
    as: ElementType
    maxLines: number | undefined
  }
>

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Text-overflowTooltipWrapper shr-relative',
    shadowWrapper:
      'shr-invisible shr-absolute shr-left-0 shr-top-0 shr-h-full shr-w-full shr-overflow-hidden shr-whitespace-normal shr-opacity-0 [display:-webkit-box]',
    shadow: 'smarthr-ui-Text-overflowTooltipShadow shr-absolute shr-left-0 shr-top-0 shr-w-full',
  },
  variants: {
    isOverflowing: {
      true: {
        wrapper: [
          'smarthr-ui-Tooltip',
          'shr-inline-block shr-max-w-full shr-align-bottom',
          'focus-visible:shr-focus-indicator--outer',
        ],
      },
    },
  },
})

const CLASS_NAMES = (() => {
  const { wrapper, shadowWrapper, shadow } = classNameGenerator()

  return {
    wrapper: wrapper(),
    tooltipTrigger: wrapper({ isOverflowing: true }),
    shadowWrapper: shadowWrapper(),
    shadow: shadow(),
  }
})()

const MEASUREMENT_STYLES = [
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'wordSpacing',
  'whiteSpace',
  'wordBreak',
  'overflowWrap',
  // HINT: 計測用の要素には本文の開始位置に影響する上余白を反映する
  'paddingTop',
] as const

const parsePixels = (value: string) => Number.parseFloat(value) || 0

const getTextWidth = (element: Element, style: CSSStyleDeclaration) => {
  const padding = parsePixels(style.paddingLeft) + parsePixels(style.paddingRight)

  // HINT: clientWidth は整数に丸められるため、折り返し位置が変わらないように使用幅の端数も保つ
  if (!style.width.endsWith('px')) {
    return Math.max(0, element.clientWidth - padding)
  }

  const width = parsePixels(style.width)
  if (style.boxSizing === 'border-box') {
    const border = parsePixels(style.borderLeftWidth) + parsePixels(style.borderRightWidth)
    return Math.max(0, width - padding - border)
  }

  return width
}

const isCssKeyword = (value: CSSStyleValue | undefined, keyword: string) =>
  value !== undefined && 'value' in value && value.value === keyword

const isLineClamped = (element: Element, style: CSSStyleDeclaration) => {
  if (style.webkitBoxOrient !== 'vertical' || !(Number(style.webkitLineClamp) > 0)) {
    return false
  }

  if (style.display === '-webkit-box' || style.display === '-webkit-inline-box') {
    return true
  }

  if (
    (style.display !== 'flow-root' && style.display !== 'inline-block') ||
    (element as HTMLElement).style?.display === style.display
  ) {
    return false
  }

  // HINT: Chromium は行数制限中の -webkit-box を flow-root、-webkit-inline-box を inline-block として返す
  // 高さも指定されている場合は同じ表示形式から区別できないため、高さの実測値で判定する
  const styleMap = element.computedStyleMap?.()
  return (
    styleMap !== undefined &&
    isCssKeyword(styleMap.get('height'), 'auto') &&
    isCssKeyword(styleMap.get('max-height'), 'none')
  )
}

export const TextOverflowTooltip: FC<Props> = ({ as: Component, children, maxLines, ...rest }) => {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null)
  const messageId = useId()
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const pointer = useRef({ hovered: false, touching: false })
  const frame = useAnimationFrame()

  const updateTooltipRect = useCallback(
    (
      wrapper: HTMLElement,
      overflowing: boolean,
      focused = wrapper.contains(wrapper.ownerDocument.activeElement),
    ) => {
      const { hovered, touching } = pointer.current
      const rect =
        overflowing && (focused || hovered || touching) ? wrapper.getBoundingClientRect() : null

      setTooltipRect((current) =>
        current &&
        rect &&
        current.x === rect.x &&
        current.y === rect.y &&
        current.width === rect.width &&
        current.height === rect.height
          ? current
          : rect,
      )
    },
    [],
  )

  // 省略を初めて検知したときは、表示用のクラスが付いた後の位置を使う
  useLayoutEffect(() => {
    if (wrapperRef.current) {
      updateTooltipRect(wrapperRef.current, isOverflowing)
    }
  }, [isOverflowing, updateTooltipRect])

  const handleDelegatePointer = ({
    currentTarget,
    target,
    pointerType,
    type,
  }: PointerEvent<HTMLSpanElement>) => {
    if (pointerType !== 'touch' && currentTarget.contains(target as Node)) {
      pointer.current.hovered = type === 'pointerenter'
      updateTooltipRect(currentTarget, isOverflowing)
    }
  }

  const handleDelegateTouch = ({ currentTarget, target, type }: TouchEvent<HTMLSpanElement>) => {
    if (currentTarget.contains(target as Node)) {
      pointer.current.touching = type === 'touchstart'
      updateTooltipRect(currentTarget, isOverflowing)
    }
  }

  const handleDelegateFocus = ({
    currentTarget,
    target,
    relatedTarget,
    type,
  }: FocusEvent<HTMLSpanElement>) => {
    if (currentTarget.contains(target as Node)) {
      updateTooltipRect(
        currentTarget,
        isOverflowing,
        type === 'focus' || currentTarget.contains(relatedTarget),
      )
    }
  }

  const shadowCallbackRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      const shadowWrapper = node?.parentElement
      const wrapper = shadowWrapper?.parentElement
      if (!node || !shadowWrapper || !wrapper) {
        return
      }

      const reflectOverflow = (overflowing: boolean) => {
        setIsOverflowing(overflowing)
        updateTooltipRect(wrapper, overflowing)
      }

      let observedTarget: Element | null | undefined
      const checkOverflow = () => {
        const target = shadowWrapper.previousElementSibling
        if (target !== observedTarget) {
          if (observedTarget) {
            resizeObserver.unobserve(observedTarget)
          }
          observedTarget = target

          mutationObserver.disconnect()
          mutationObserver.observe(wrapper, { childList: true })
          mutationObserver.observe(node, {
            childList: true,
            subtree: true,
            characterData: true,
          })
          if (target) {
            resizeObserver.observe(target)
            mutationObserver.observe(target, {
              attributes: true,
              attributeFilter: ['class', 'style'],
            })
          }
        }

        if (!target) {
          reflectOverflow(false)
          return
        }
        if (maxLines === 1) {
          reflectOverflow(target.scrollWidth > target.clientWidth)
          return
        }

        const style = getComputedStyle(target)
        if (
          maxLines === undefined &&
          style.overflowX !== 'visible' &&
          (style.whiteSpace === 'nowrap' ||
            style.whiteSpace === 'pre' ||
            style.getPropertyValue('text-wrap-mode') === 'nowrap') &&
          target.scrollWidth > target.clientWidth
        ) {
          reflectOverflow(true)
          return
        }

        // HINT: -webkit-line-clamp の scrollHeight はブラウザー間で差があるため、同じ幅と文字スタイルの計測用要素と高さを比較する
        // 参考: https://github.com/kufu/smarthr-ui/pull/4710
        const width = `${getTextWidth(target, style)}px`
        if (node.style.width !== width) {
          node.style.width = width
        }
        for (const property of MEASUREMENT_STYLES) {
          if (node.style[property] !== style[property]) {
            node.style[property] = style[property]
          }
        }

        // HINT: 行数制限の省略記号は、下余白で後続の行が見えていても文字を隠すことがある
        // clientHeight は整数なので、余白の端数を切り捨て、収まる本文の誤検知を避ける
        const bottomPadding = Math.floor(parsePixels(style.paddingBottom))
        const targetHeight =
          bottomPadding > 0 && isLineClamped(target, style)
            ? target.clientHeight - bottomPadding
            : target.clientHeight
        reflectOverflow(node.clientHeight > targetHeight)
      }

      // HINT: 計測に伴う幅の更新を ResizeObserver の通知サイクルから分離する
      const scheduleCheck = () => frame.request(checkOverflow)
      // HINT: メディアクエリで文字サイズだけが変わる場合、本文のボックスサイズが変わらないことがある
      const view = node.ownerDocument.defaultView
      view?.addEventListener('resize', scheduleCheck)
      const resizeObserver = new ResizeObserver(scheduleCheck)
      resizeObserver.observe(wrapper)
      resizeObserver.observe(node)
      const mutationObserver = new MutationObserver(scheduleCheck)

      checkOverflow()

      return () => {
        view?.removeEventListener('resize', scheduleCheck)
        resizeObserver.disconnect()
        mutationObserver.disconnect()
        frame.cancel()
      }
    },
    [Component, frame, maxLines, updateTooltipRect],
  )

  const tooltipTabIndex = isOverflowing ? 0 : undefined

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      ref={wrapperRef}
      tabIndex={tooltipTabIndex}
      className={isOverflowing ? CLASS_NAMES.tooltipTrigger : CLASS_NAMES.wrapper}
      aria-describedby={isOverflowing ? messageId : undefined}
      onPointerEnter={handleDelegatePointer}
      onPointerLeave={handleDelegatePointer}
      onTouchStart={handleDelegateTouch}
      onTouchEnd={handleDelegateTouch}
      onTouchCancel={handleDelegateTouch}
      onFocus={handleDelegateFocus}
      onBlur={handleDelegateFocus}
    >
      <Component {...rest}>{children}</Component>
      {/* 切り取られていないテキストの高さを取得するための要素 */}
      <span className={CLASS_NAMES.shadowWrapper} aria-hidden>
        <span ref={shadowCallbackRef} className={CLASS_NAMES.shadow}>
          {children}
        </span>
      </span>
      {isOverflowing && (
        <TooltipPortal
          messageId={messageId}
          isVisible={tooltipRect !== null}
          parentRect={tooltipRect}
          message={children}
        />
      )}
    </span>
  )
}
