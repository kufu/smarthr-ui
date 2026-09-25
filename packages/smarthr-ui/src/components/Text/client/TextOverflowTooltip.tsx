'use client'

import {
  type ComponentPropsWithRef,
  type ElementType,
  type FC,
  type Ref,
  useCallback,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { Tooltip } from '../../Tooltip'

type Props = {
  as: ElementType
  outerRef?: Ref<HTMLElement>
} & Omit<ComponentPropsWithRef<'span'>, 'as' | 'ref'>

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
  const shadowCallbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const checkOverflow = () => {
        // node(shadow) -> shadowWrapper(parentElement) -> Component(previousElementSibling)
        const target = node.parentElement?.previousElementSibling as HTMLElement | null

        if (target) {
          setIsOverflowing(node.clientHeight > target.clientHeight)
        }
      }

      checkOverflow()

      window.addEventListener('resize', checkOverflow)

      // HINT: childrenの変更を検知するため、nodeの子要素・テキストの変化を監視する
      const mutationObserver = new MutationObserver(checkOverflow)
      mutationObserver.observe(node, {
        childList: true,
        subtree: true,
        characterData: true,
      })

      return () => {
        window.removeEventListener('resize', checkOverflow)
        mutationObserver.disconnect()
      }
    }, []),
  )

  const content = (
    <span className={CLASS_NAMES.wrapper}>
      <Component {...rest} ref={outerRef} className={className}>
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
