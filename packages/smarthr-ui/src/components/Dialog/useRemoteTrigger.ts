import { useCallback, useEffect, useRef, useState } from 'react'

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
  const unstableRef = useRef({
    onToggle,
    onOpen,
    onClose,
    orgOnClickClose,
    orgOnPressEscape,
  })
  unstableRef.current = {
    onToggle,
    onOpen,
    onClose,
    orgOnClickClose,
    orgOnPressEscape,
  }

  const updateIsOpen = useCallback((newIsOpen: boolean) => {
    setIsOpen(newIsOpen)
    unstableRef.current.onToggle?.(newIsOpen)

    if (newIsOpen) {
      unstableRef.current.onOpen?.()
    } else {
      unstableRef.current.onClose?.()
    }
  }, [])

  const onClickClose = useCallback(() => {
    if (unstableRef.current.orgOnClickClose) {
      return unstableRef.current.orgOnClickClose(() => {
        updateIsOpen(false)
      })
    }

    updateIsOpen(false)
  }, [updateIsOpen])

  const onPressEscape = useCallback(() => {
    if (unstableRef.current.orgOnPressEscape) {
      return unstableRef.current.orgOnPressEscape(() => {
        updateIsOpen(false)
      })
    }

    updateIsOpen(false)
  }, [updateIsOpen])

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
