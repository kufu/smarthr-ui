'use client'

import { type ComponentPropsWithRef, type ElementType, type FC, type Ref, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { Tooltip } from '../../Tooltip'

type Props = {
  as: ElementType
  outerRef?: Ref<HTMLElement>
} & Omit<ComponentPropsWithRef<'span'>, 'as' | 'ref'>

const SHADOW_CLASS_NAME = 'smarthr-ui-Text-overflowTooltipShadow'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Text-overflowTooltipWrapper shr-relative',
    shadowWrapper:
      'shr-invisible shr-absolute shr-left-0 shr-top-0 shr-h-full shr-w-full shr-overflow-hidden shr-whitespace-normal shr-opacity-0 [display:-webkit-box]',
    shadow: `${SHADOW_CLASS_NAME} shr-absolute shr-left-0 shr-top-0 shr-w-full`,
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

export const TextOverflowTooltip: FC<Props> = ({
  as: Component,
  outerRef,
  className,
  children,
  ...rest
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false)

  // HINT: -webkit-line-clamp を使った要素ではel.scrollHeightとel.clientHeightの比較だと
  // フォントの高さの計算が期待と異なり適切な高さが取得できないためshadow要素と比較している
  // 参考: https://github.com/kufu/smarthr-ui/pull/4710
  const layoutEffectRef = useLayoutEffectRef<HTMLElement>(
    (node) => {
      if (!node) {
        return
      }

      const checkOverflow = () => {
        const shadow = node.parentElement?.querySelector<HTMLElement>(`.${SHADOW_CLASS_NAME}`)

        if (shadow) {
          setIsOverflowing(shadow.clientHeight > node.clientHeight)
        }
      }

      checkOverflow()

      window.addEventListener('resize', checkOverflow)

      return () => window.removeEventListener('resize', checkOverflow)
    },
    // TODO: 将来的にMutationObserverに置き換えて、children の変更を監視する実装に変更する
    [children, className],
  )

  const mergedRef = useMergeRefs(layoutEffectRef, outerRef)

  const content = (
    <span className={CLASS_NAMES.wrapper}>
      <Component {...rest} ref={mergedRef} className={className}>
        {children}
      </Component>
      {/* 切り取られていないテキストの高さを取得するための要素 */}
      <span className={CLASS_NAMES.shadowWrapper} aria-hidden>
        <span className={CLASS_NAMES.shadow}>{children}</span>
      </span>
    </span>
  )

  return isOverflowing ? <Tooltip message={children}>{content}</Tooltip> : content
}
