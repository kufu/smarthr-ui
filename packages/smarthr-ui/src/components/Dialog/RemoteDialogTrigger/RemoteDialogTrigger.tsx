'use client'

import {
  type FC,
  type MouseEvent,
  type ReactElement,
  cloneElement,
  useCallback,
  useMemo,
} from 'react'

import { TRIGGER_EVENT } from '../useRemoteTrigger'

const onClickRemoteDialogTrigger = (ariaControls: string) => {
  document.dispatchEvent(
    new CustomEvent(TRIGGER_EVENT, {
      detail: { id: ariaControls },
    }),
  )
}

export const RemoteDialogTrigger: FC<{
  targetId: string
  onClick?: (open: () => void) => void
  children: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls'>
}> = ({ targetId, children, onClick, ...rest }) => {
  const actualOnClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      // HINT: onClick内で非同期処理される場合、e.currentTargetがnullになってしまう可能性があるため
      // 先にariaControlsを取得しておく
      const ariaControls = e.currentTarget.getAttribute('aria-controls') as string

      if (onClick) {
        return onClick(() => {
          onClickRemoteDialogTrigger(ariaControls)
        })
      }

      onClickRemoteDialogTrigger(ariaControls)
    },
    [onClick],
  )
  const actualTrigger = useMemo(
    () =>
      cloneElement(children as ReactElement, {
        ...rest,
        onClick: actualOnClick,
        'aria-haspopup': 'dialog',
        'aria-controls': targetId,
      }),
    [children, actualOnClick, targetId, rest],
  )

  return actualTrigger
}
