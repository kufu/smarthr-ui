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
  const propsRef = useRef({
    onToggle,
    onOpen,
    onClose,
    orgOnClickClose,
    orgOnPressEscape,
  })
  propsRef.current = {
    onToggle,
    onOpen,
    onClose,
    orgOnClickClose,
    orgOnPressEscape,
  }

  const onClickClose = useCallback(() => {
    if (propsRef.current.orgOnClickClose) {
      return propsRef.current.orgOnClickClose(() => {
        setIsOpen(false)
      })
    }

    setIsOpen(false)
  }, [])

  const onPressEscape = useCallback(() => {
    if (propsRef.current.orgOnPressEscape) {
      return propsRef.current.orgOnPressEscape(() => {
        setIsOpen(false)
      })
    }

    setIsOpen(false)
  }, [])

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
    propsRef.current.onToggle?.(isOpen)

    if (isOpen) {
      propsRef.current.onOpen?.()
    } else {
      propsRef.current.onClose?.()
    }
  }, [isOpen])

  return {
    isOpen,
    onClickClose,
    onPressEscape,
  }
}
