'use client'

import { type FC, type PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { TRIGGER_EVENT } from '../useRemoteTrigger'

const CAPTURE_OPTION = {
  capture: true,
}

const onClickRemoteDialogTrigger = (ariaControls: string) => {
  document.dispatchEvent(
    new CustomEvent(TRIGGER_EVENT, {
      detail: { id: ariaControls },
    }),
  )
}

export const RemoteDialogTrigger: FC<
  PropsWithChildren<{
    targetId: string
    onClick?: (open: () => void) => void
  }>
> = ({ targetId, children, onClick }) => {
  const ref = useRef<HTMLSpanElement | null>(null)
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  const actualOnClick = useCallback((e: Event) => {
    // HINT: onClick内で非同期処理される場合、e.currentTargetがnullになってしまう可能性があるため
    // 先にariaControlsを取得しておく
    const ariaControls = (e.currentTarget as HTMLElement).getAttribute('aria-controls') as string

    if (onClickRef.current) {
      return onClickRef.current(() => {
        onClickRemoteDialogTrigger(ariaControls)
      })
    }

    onClickRemoteDialogTrigger(ariaControls)
  }, [])

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) {
      return
    }

    // 現在の子要素に対して処理を実行
    const setupElement = () => {
      const element = currentRef.querySelector<HTMLButtonElement | HTMLAnchorElement>('button, a')
      if (element) {
        element.setAttribute('aria-haspopup', 'dialog')
        element.setAttribute('aria-controls', targetId)
        // HINT: DropdownCloser のonClickより先に実行するため、キャプチャフェーズで処理する
        element.addEventListener('click', actualOnClick, CAPTURE_OPTION)
      }
    }

    // 初回セットアップ
    setupElement()

    // MutationObserverでDOM変更を監視
    const observer = new MutationObserver(() => {
      // 既存のイベントリスナーをクリーンアップ
      const oldElement = currentRef.querySelector<HTMLButtonElement | HTMLAnchorElement>(
        'button, a',
      )
      if (oldElement) {
        oldElement.removeEventListener('click', actualOnClick, CAPTURE_OPTION)
      }

      // 新しい要素にセットアップ
      setupElement()
    })

    observer.observe(currentRef, {
      childList: true, // 直接の子要素の追加・削除を監視
      subtree: true, // 子孫要素の変更も監視
    })

    return () => {
      observer.disconnect()
      const element = currentRef.querySelector<HTMLButtonElement | HTMLAnchorElement>('button, a')
      if (element) {
        element.removeEventListener('click', actualOnClick, CAPTURE_OPTION)
      }
    }
  }, [targetId, actualOnClick])

  return (
    <span className="smarthr-ui-RemoteDialogTrigger shr-contents" ref={ref}>
      {children}
    </span>
  )
}
