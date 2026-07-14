import { useCallback, useEffect, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

export const TRIGGER_EVENT = 'smarthr-ui:remote-dialog-trigger-dispatch'

type Props = {
  id: string
  onClickClose?: (close: () => void) => void
  onPressEscape?: (close: () => void) => void
  onToggle?: (isOpen: boolean) => void
  onOpen?: () => void
  onClose?: () => void
}

export function useRemoteTrigger({
  onClickClose: orgOnClickClose,
  onPressEscape: orgOnPressEscape,
  onToggle,
  onOpen,
  onClose,
  id,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const latest = useLatest({
    onToggle,
    onOpen,
    onClose,
    orgOnClickClose,
    orgOnPressEscape,
  })

  const updateIsOpen = useCallback(
    (newIsOpen: boolean) => {
      setIsOpen(newIsOpen)
      latest.onToggle?.(newIsOpen)

      if (newIsOpen) {
        latest.onOpen?.()
      } else {
        latest.onClose?.()
      }
    },
    [latest],
  )

  const onClickClose = useCallback(() => {
    if (latest.orgOnClickClose) {
      return latest.orgOnClickClose(() => {
        updateIsOpen(false)
      })
    }

    updateIsOpen(false)
  }, [updateIsOpen, latest])

  const onPressEscape = useCallback(() => {
    if (latest.orgOnPressEscape) {
      return latest.orgOnPressEscape(() => {
        updateIsOpen(false)
      })
    }

    updateIsOpen(false)
  }, [updateIsOpen, latest])

  useEffect(() => {
    const handler = ((e: Event & { detail: { id: string } }) => {
      if (id === e.detail.id) {
        updateIsOpen(true)
      }
    }) as Parameters<typeof document.addEventListener>['1']

    document.addEventListener(TRIGGER_EVENT, handler)

    return () => {
      document.removeEventListener(TRIGGER_EVENT, handler)
    }
  }, [id, updateIsOpen])

  return {
    isOpen,
    onClickClose,
    onPressEscape,
  }
}
