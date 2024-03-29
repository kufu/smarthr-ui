import { useCallback, useEffect, useState } from 'react'

export const TRIGGER_EVENT = 'smarthr-ui:remote-dialog-trigger-dispatch'

export function useRemoteTrigger({
  onClickClose: orgOnClickClose,
  onPressEscape: orgOnPressEscape,
  onToggle,
  onOpen,
  onClose,
  id,
}: {
  id: string
  onClickClose?: (close: () => void) => void
  onPressEscape?: (close: () => void) => void
  onToggle?: (isOpen: boolean) => void
  onOpen?: () => void
  onClose?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

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
    if (onToggle) {
      onToggle(isOpen)
    }
    if (onOpen && isOpen) {
      onOpen()
    }
    if (onClose && !isOpen) {
      onClose()
    }
    // HINT: 再レンダリング際にhookを利用していないonToggleなどが渡されると意図せず発火してしまう場合がありえるため
    // onToggle, onOpen, onClose を depsに含めていません
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return {
    isOpen,
    onClickClose,
    onPressEscape,
  }
}
