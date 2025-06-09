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
  const togglerRef = useRef<Pick<Props, 'onToggle' | 'onOpen' | 'onClose'>>({
    onToggle,
    onOpen,
    onClose,
  })

  const onClickClose = useCallback(() => {
    if (orgOnClickClose) {
      return orgOnClickClose(() => {
        setIsOpen(false)
      })
    }

    setIsOpen(false)
  }, [orgOnClickClose])

  const onPressEscape = useCallback(() => {
    if (orgOnPressEscape) {
      return orgOnPressEscape(() => {
        setIsOpen(false)
      })
    }

    setIsOpen(false)
  }, [orgOnPressEscape])

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

  useEffect(() => {
    togglerRef.current.onToggle = onToggle
    togglerRef.current.onOpen = onOpen
    togglerRef.current.onClose = onClose
  }, [onToggle, onOpen, onClose])

  useEffect(() => {
    togglerRef.current.onToggle?.(isOpen)

    if (isOpen) {
      togglerRef.current.onOpen?.()
    } else {
      togglerRef.current.onClose?.()
    }
  }, [isOpen])

  return {
    isOpen,
    onClickClose,
    onPressEscape,
  }
}
