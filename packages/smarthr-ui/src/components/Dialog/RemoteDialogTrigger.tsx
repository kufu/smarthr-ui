'use client'

import React, { ReactElement, cloneElement, useCallback, useMemo } from 'react'

import { Button } from '../Button'

import { TRIGGER_EVENT } from './useRemoteTrigger'

const onClickRemoteDialogTrigger = (e: React.MouseEvent<HTMLElement>) => {
  document.dispatchEvent(
    new CustomEvent(TRIGGER_EVENT, {
      detail: { id: e.currentTarget.getAttribute('aria-controls') as string },
    }),
  )
}

export const RemoteDialogTrigger: React.FC<
  Pick<React.ComponentProps<typeof Button>, 'variant'> & {
    targetId: string
    onClick?: (open: () => void) => void
    children: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls' | 'variant'>
  }
> = ({ targetId, children, onClick, variant, ...rest }) => {
  const actualOnClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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
        'aria-haspopup': 'true',
        'aria-controls': targetId,
        variant,
        ...rest,
      }),
    [children, actualOnClick, targetId, variant, rest],
  )

  return actualTrigger
}
