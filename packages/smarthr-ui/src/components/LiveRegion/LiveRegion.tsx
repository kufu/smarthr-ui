'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import { useCallbackRefCleanupForReact18 } from '../../hooks/client/useCallbackRefCleanupForReact18'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type BaseProps = PropsWithChildren
type Props = BaseProps & Omit<ComponentPropsWithRef<'span'>, keyof BaseProps>

export const LiveRegion: FC<Props> = ({ role, children, ...rest }) => {
  const [liveText, setLiveText] = useState('')

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const visibleTextElm = node.querySelector<HTMLElement>('.smarthr-ui-LiveRegion-visibleText')

      if (!visibleTextElm) {
        return
      }

      let beforeVisibleText = ''
      const action = () => {
        const visibleText = visibleTextElm.innerText

        if (beforeVisibleText !== visibleText) {
          beforeVisibleText = visibleText
          setLiveText(visibleText)
        }
      }

      let timeoutId: ReturnType<typeof setTimeout> | null = null
      const clearTimeoutAction = () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
        }
      }
      const timeoutAction = () => {
        // HINT: 要素を空の状態でDOMに挿入してから遅延してテキストを設定することで、
        // スクリーンリーダーの購読処理が間に合わずアナウンスが欠落するのを防ぐ。
        clearTimeoutAction()
        timeoutId = setTimeout(action, 100)
      }

      timeoutAction()

      const observer = new MutationObserver(timeoutAction)
      observer.observe(visibleTextElm, {
        childList: true,
        subtree: true,
        characterData: true,
      })

      return () => {
        clearTimeoutAction()
        observer.disconnect()
      }
    }, []),
  )

  return (
    <span {...rest} ref={callbackRef}>
      <span className="smarthr-ui-LiveRegion-visibleText" aria-hidden={true}>
        {children}
      </span>
      <VisuallyHiddenText
        as="output"
        role={role || 'status'}
        className="smarthr-ui-LiveRegion-visuallyHiddenText"
      >
        {liveText}
      </VisuallyHiddenText>
    </span>
  )
}
