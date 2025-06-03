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

const onClickRemoteDialogTrigger = (e: MouseEvent<HTMLElement>) => {
  document.dispatchEvent(
    new CustomEvent(TRIGGER_EVENT, {
      detail: { id: e.currentTarget.getAttribute('aria-controls') as string },
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
      if (onClick) {
        return onClick(() => {
          onClickRemoteDialogTrigger(e)
        })
      }

      onClickRemoteDialogTrigger(e)
    },
    [onClick],
  )
  const actualTrigger = useMemo(
    () =>
      cloneElement(children as ReactElement, {
        onClick: actualOnClick,
        'aria-haspopup': 'dialog',
        'aria-controls': targetId,
        ...rest,
      }),
    [children, actualOnClick, targetId, rest],
  )

  return actualTrigger
}
