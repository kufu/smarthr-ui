'use client'

import { type ElementType, type FC, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { Tooltip } from '../../Tooltip'

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
})

const CLASS_NAMES = (() => {
  const { wrapper, shadowWrapper, shadow } = classNameGenerator()

  return {
    wrapper: wrapper(),
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
  // HINT: 上の余白は本文の開始位置に影響する。下の余白は行の描画に使われるため、計測側には加えない
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

export const TextOverflowTooltip: FC<Props> = ({
  as: Component,
  className,
  children,
  maxLines,
  ...rest
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const frame = useAnimationFrame()

  const shadowCallbackRef = useLayoutEffectRef(
    (node: HTMLElement | null) => {
      const shadowWrapper = node?.parentElement
      const wrapper = shadowWrapper?.parentElement
      if (!node || !shadowWrapper || !wrapper) {
        return
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
          setIsOverflowing(false)
          return
        }
        if (maxLines === 1) {
          setIsOverflowing(target.scrollWidth > target.clientWidth)
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
          setIsOverflowing(true)
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

        setIsOverflowing(node.clientHeight > target.clientHeight)
      }

      // HINT: 計測に伴う幅の更新を ResizeObserver の通知サイクルから分離する
      const scheduleCheck = () => frame.request(checkOverflow)
      // HINT: メディアクエリで文字サイズだけが変わる場合、本文のボックスサイズが変わらないことがある
      const view = node.ownerDocument.defaultView
      view?.addEventListener('resize', scheduleCheck)
      const resizeObserver = new ResizeObserver(scheduleCheck)
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
    [Component, frame, maxLines],
  )

  const content = (
    <span className={CLASS_NAMES.wrapper}>
      <Component {...rest} className={className}>
        {children}
      </Component>
      {/* 切り取られていないテキストの高さを取得するための要素 */}
      <span className={CLASS_NAMES.shadowWrapper} aria-hidden>
        <span ref={shadowCallbackRef} className={CLASS_NAMES.shadow}>
          {children}
        </span>
      </span>
    </span>
  )

  // HINT: isOverflowingがfalse→trueに切り替わるとJSXのルート要素の型が
  // span→Tooltipに変わるため、Reactはこのサブツリーをアンマウント/リマウントする。
  // 初回判定(false→true)はcallback ref内での同期的な実行によりペイント前に完結するため
  // ユーザーには見えないが、resizeなどペイント後にtrue→falseへ戻る場合は
  // 一瞬のちらつきが理論上発生しうる。発生頻度が低く実害が小さいため許容している
  return isOverflowing ? <Tooltip message={children}>{content}</Tooltip> : content
}
