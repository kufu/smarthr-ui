'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react'

import { useCallbackRefCleanupForReact18 } from '../../hooks/client/useCallbackRefCleanupForReact18'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type BaseProps = PropsWithChildren & {
  hasFlowContent?: boolean
  announceDelay?: number
  skipInitialAnnounce?: boolean
  htmlFor?: string
  visuallyHidden?: boolean
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>

export const LiveRegion: FC<Props> = ({
  hasFlowContent,
  announceDelay = 100,
  skipInitialAnnounce,
  role,
  htmlFor,
  visuallyHidden,
  id,
  children,
  ...rest
}) => {
  const [liveText, setLiveText] = useState('')
  // HINT: マウント時の挙動のみを制御するオプションのため、mount後の変化を追わずuseRefで初期値を固定する
  const skipInitialAnnounceRef = useRef(skipInitialAnnounce)

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

        if (skipInitialAnnounceRef.current) {
          // HINT: マウント時点で見た目と同じテキストを即座に設定することで、
          // 空文字からの変化として検知されるのを防ぎ、初回マウント時の通知を抑制する
          // (このタイミングでも読み上げてしまうブラウザ・スクリーンリーダーの組み合わせはあり得るが許容する)
          action()
        } else {
          timeoutAction()
        }

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
