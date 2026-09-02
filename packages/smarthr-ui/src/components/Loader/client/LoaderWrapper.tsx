'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useCallback } from 'react'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'

type BaseProps = PropsWithChildren
type Props = BaseProps & Omit<ComponentProps<'span'>, keyof BaseProps>

export const LoaderWrapper: FC<Props> = ({ role = 'status', children, ...rest }) => {
  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback(
      (node: HTMLElement | null) => {
        if (!node) {
          return
        }

        const ariaNotifyAction = () => {
          document.ariaNotify(node.innerText, { priority: role === 'alert' ? 'high' : 'normal' })
        }

        ariaNotifyAction()

        const observer = new MutationObserver(ariaNotifyAction)
        observer.observe(node, {
          childList: true,
          subtree: true,
          characterData: true,
        })

        return () => {
          observer.disconnect()
        }
      },
      // HINT: 実用上、roleが動的に変化する可能性はほぼないため、そのまま依存関係に含めている
      // 変化する場合がある際はuseLatestで固定する
      [role],
    ),
  )

  return (
    <span {...rest} ref={callbackRef}>
      {children}
    </span>
  )
}
