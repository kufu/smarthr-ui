import React, { ReactElement, cloneElement, useCallback, useEffect, useMemo, useState } from 'react'

import { ActionDialog } from '../ActionDialog'

type Props = Omit<React.ComponentProps<typeof ActionDialog>, 'isOpen' | 'onClickClose' | 'id'> & {
  id: string
  onClickClose?: (close: () => void) => void
}

const TRIGGER_EVENT = 'smarthr-ui-remote-trigger-action-dialog-dispatch'
const onClickRemoteDialogTrigger = (e: React.MouseEvent<HTMLElement>) => {
  document.dispatchEvent(
    new CustomEvent(TRIGGER_EVENT, {
      detail: { id: e.currentTarget.getAttribute('aria-controls') as string },
    }),
  )
}

export const RemoteDialogTrigger: React.FC<{
  targetId: string
  onClick?: (open: () => void) => void
  children: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls'>
}> = ({ targetId, children, onClick }) => {
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
      }),
    [children, targetId, actualOnClick],
  )

  return actualTrigger
}

export const RemoteTriggerActionDialog: React.FC<Props> = ({ id, onClickClose, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)

  const actualOnClickClose = useCallback(() => {
    if (onClickClose) {
      return onClickClose(() => {
        setIsOpen(false)
      })
    }

    setIsOpen(false)
  }, [onClickClose])

  useEffect(() => {
    const handler = ((e: Event & { detail: { id: string } }) => {
      if (id === e.detail.id) {
        setIsOpen(true)
      }
    }) as Parameters<typeof document.addEventListener>['1']

    document.addEventListener(TRIGGER_EVENT, handler)

    return () => {
      document.removeEventListener(TRIGGER_EVENT, handler)
    }
  }, [id])

  return <ActionDialog {...props} id={id} isOpen={isOpen} onClickClose={actualOnClickClose} />
}
