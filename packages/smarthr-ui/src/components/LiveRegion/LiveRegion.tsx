'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useState,
} from 'react'

import { useCallbackRefCleanupForReact18 } from '../../hooks/client/useCallbackRefCleanupForReact18'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type BaseProps = PropsWithChildren & {
  announceDelay?: number
  skipInitialAnnounce?: boolean
  visuallyHidden?: boolean
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseProps>

export const LiveRegion: FC<Props> = ({
  announceDelay = 100,
  skipInitialAnnounce,
  role,
  visuallyHidden,
  id,
  children,
  ...rest
}) => {
  // HINT: skipInitialAnnounce時のみ、見た目と同じ内容で初期化する。
  // それ以外の場合は空の状態でマウントしてから遅延してテキストを設定する必要があるため('' のままにする)
  const [liveText, setLiveText] = useState<ReactNode>(() => (skipInitialAnnounce ? children : ''))

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

        if (!skipInitialAnnounce) {
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

        // HINT: 変化した場合callbackRefが再生成されてしまうので本来はuseRefを利用して
        // 依存配列を空にすべきだが、LiveRegionの実用上これらの値の参照が変化する可能性は現状無い
        // 必要が生じたらannounceDelayは可変、skipInitialAnnounceは不変の状態でuseRefを使うこと
      },
      [announceDelay, skipInitialAnnounce],
    ),
  )

  const VisibleContent = 'span'
  const { Wrapper, wrapperAs, Invisible, invisibleAs } = visuallyHidden
    ? {
        Wrapper: VisuallyHiddenText,
        wrapperAs: VisibleContent,
        Invisible: 'span',
        invisibleAs: undefined,
      }
    : {
        Wrapper: VisibleContent,
        wrapperAs: undefined,
        Invisible: VisuallyHiddenText,
        invisibleAs: 'span',
      }

  return (
    <Wrapper {...rest} as={wrapperAs} ref={callbackRef}>
      <VisibleContent
        id={id}
        className="smarthr-ui-LiveRegion-visibleContent shr-contents"
        aria-hidden={true}
      >
        {children}
      </VisibleContent>
      <Invisible
        as={invisibleAs}
        role={role || 'status'}
        className="smarthr-ui-LiveRegion-visuallyHiddenText"
      >
        {liveText}
      </Invisible>
    </Wrapper>
  )
}
