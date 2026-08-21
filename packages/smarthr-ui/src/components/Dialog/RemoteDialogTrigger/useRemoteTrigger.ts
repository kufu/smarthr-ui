import { useEffect, useMemo, useState } from 'react'

import { useAnimationFrame } from '../../../hooks/useAnimationFrame'
import { useLatest } from '../../../hooks/useLatest'

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
  onClickClose,
  onPressEscape,
  onToggle,
  onOpen,
  onClose,
  id,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleFrame = useAnimationFrame()
  const latest = useLatest({
    onToggle,
    onOpen,
    onClose,
    onClickClose,
    onPressEscape,
    toggleFrame,
  })

  const functions = useMemo(() => {
    const updateIsOpen = (newIsOpen: boolean) => {
      setIsOpen(newIsOpen)

      if (latest.onToggle || latest[newIsOpen ? 'onOpen' : 'onClose']) {
        // HINT: 利用者側でstateの更新が行われている可能性があるため、遅延させる
        latest.toggleFrame.request(() => {
          latest.onToggle?.(newIsOpen)
          latest[newIsOpen ? 'onOpen' : 'onClose']?.()
        })
      }
    }

    return {
      updateIsOpen,
      handleClickClose: () => {
        if (latest.onClickClose) {
          return latest.onClickClose(() => {
            updateIsOpen(false)
          })
        }

        updateIsOpen(false)
      },
      handlePressEscape: () => {
        if (latest.onPressEscape) {
          return latest.onPressEscape(() => {
            updateIsOpen(false)
          })
        }

        updateIsOpen(false)
      },
    }
  }, [latest])

  useEffect(() => {
    const handler = ((e: Event & { detail: { id: string } }) => {
      if (id === e.detail.id) {
        functions.updateIsOpen(true)
      }
    }) as Parameters<typeof document.addEventListener>['1']

    document.addEventListener(TRIGGER_EVENT, handler)

    return () => {
      // HINT: アンマウント後に予約済みのonToggle・onOpen・onCloseが呼ばれないようにする
      toggleFrame.cancel()
      document.removeEventListener(TRIGGER_EVENT, handler)
    }
  }, [id, toggleFrame, functions])

  return {
    isOpen,
    handleClickClose: functions.handleClickClose,
    handlePressEscape: functions.handlePressEscape,
  }
}
