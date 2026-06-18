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

  const actualOnClick = useCallback(
    (e: Event) => {
      // HINT: onClick内で非同期処理される場合、e.currentTargetがnullになってしまう可能性があるため
      // 先にariaControlsを取得しておく
      const ariaControls = (e.currentTarget as HTMLElement).getAttribute('aria-controls') as string

      if (onClick) {
        return onClick(() => {
          onClickRemoteDialogTrigger(ariaControls)
        })
      }

      onClickRemoteDialogTrigger(ariaControls)
    },
    [onClick],
  )

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const element = ref.current.querySelector<HTMLButtonElement | HTMLAnchorElement>('button, a')

    if (!element) {
      return
    }

    element.setAttribute('aria-haspopup', 'dialog')
    element.setAttribute('aria-controls', targetId)
    // HINT: DropdownCloser のonClickより先に実行するため、キャプチャフェーズで処理する
    element.addEventListener('click', actualOnClick, CAPTURE_OPTION)

    return () => {
      element.removeEventListener('click', actualOnClick, CAPTURE_OPTION)
    }
  }, [children, actualOnClick, targetId])

  return (
    <span className="smarthr-ui-RemoteDialogTrigger shr-contents" ref={ref}>
      {children}
    </span>
  )
}
