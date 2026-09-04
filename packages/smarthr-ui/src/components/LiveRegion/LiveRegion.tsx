'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useCallback,
  useState,
} from 'react'

import { useCallbackRefCleanupForReact18 } from '../../hooks/client/useCallbackRefCleanupForReact18'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type BaseProps = PropsWithChildren & {
  hasFlowContent?: boolean
  announceDelay?: number
  htmlFor?: string
  visuallyHidden?: boolean
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>

export const LiveRegion: FC<Props> = ({
  hasFlowContent,
  announceDelay = 100,
  role,
  htmlFor,
  visuallyHidden,
  id,
  children,
  ...rest
}) => {
  const [liveText, setLiveText] = useState('')

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback(
      (node: HTMLElement | null) => {
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
          timeoutId = setTimeout(action, announceDelay)
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
      },
      [announceDelay],
    ),
  )

  const VisibleContent = hasFlowContent ? 'div' : 'span'
  const { Wrapper, wrapperAs, Output, outputAs } = visuallyHidden
    ? {
        Wrapper: VisuallyHiddenText,
        wrapperAs: VisibleContent,
        Output: 'output',
        outputAs: undefined,
      }
    : {
        Wrapper: VisibleContent,
        wrapperAs: undefined,
        Output: VisuallyHiddenText,
        outputAs: 'output',
      }

  return (
    <Wrapper {...rest} as={wrapperAs} ref={callbackRef}>
      <VisibleContent id={id} className="smarthr-ui-LiveRegion-visibleContent" aria-hidden={true}>
        {children}
      </VisibleContent>
      <Output
        as={outputAs}
        role={role || 'status'}
        htmlFor={htmlFor}
        className="smarthr-ui-LiveRegion-visuallyHiddenText"
      >
        {liveText}
      </Output>
    </Wrapper>
  )
}
