'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import { useCallbackRefCleanupForReact18 } from '../../hooks/client/useCallbackRefCleanupForReact18'
import { VisuallyHiddenText, visuallyHiddenTextClassName } from '../VisuallyHiddenText'

type BaseProps = PropsWithChildren & {
  as?: 'span' | 'div'
  htmlFor?: string
  visuallyHidden?: boolean
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>

export const LiveRegion: FC<Props> = ({
  as: Component = 'span',
  role,
  htmlFor,
  visuallyHidden,
  children,
  ...rest
}) => {
  const [liveText, setLiveText] = useState('')

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const visibleTextElm = node.querySelector<HTMLElement>(
        '.smarthr-ui-LiveRegion-visibleContent',
      )

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
    <Component {...rest} ref={callbackRef}>
      <Component
        className={`smarthr-ui-LiveRegion-visibleContent${visuallyHidden ? ` ${visuallyHiddenTextClassName}` : ''}`}
        aria-hidden={true}
      >
        {children}
      </Component>
      <VisuallyHiddenText
        as="output"
        role={role || 'status'}
        htmlFor={htmlFor}
        className="smarthr-ui-LiveRegion-visuallyHiddenText"
      >
        {liveText}
      </VisuallyHiddenText>
    </Component>
  )
}
