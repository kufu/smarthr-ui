import { useCallback, useEffect, useState } from 'react'

export const TRIGGER_EVENT = 'smarthr-ui:remote-dialog-trigger-dispatch'

export function useRemoteTrigger({
  onClickClose: orgOnClickClose,
  id,
}: {
  id: string
  onClickClose?: (close: () => void) => void
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

  return {
    isOpen,
    onClickClose,
  }
}
