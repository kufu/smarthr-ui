'use client'

import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type ReactElement,
  cloneElement,
  useCallback,
  useMemo,
} from 'react'

import { TRIGGER_EVENT } from './useRemoteTrigger'

import type { Button } from '../Button'

const onClickRemoteDialogTrigger = (e: MouseEvent<HTMLElement>) => {
  document.dispatchEvent(
    new CustomEvent(TRIGGER_EVENT, {
      detail: { id: e.currentTarget.getAttribute('aria-controls') as string },
    }),
  )
}

export const RemoteDialogTrigger: FC<
  Pick<ComponentProps<typeof Button>, 'variant'> & {
    targetId: string
    onClick?: (open: () => void) => void
    children: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls' | 'variant'>
  }
> = ({ targetId, children, onClick, variant, ...rest }) => {
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
        variant,
        ...rest,
      }),
    [children, actualOnClick, targetId, variant, rest],
  )

  return actualTrigger
}
