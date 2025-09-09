import { useCallback, useEffect, useState } from 'react'

const DISCLOSURE_CHANGE_EVENT = 'smarthr-ui:disclosure-change'
type DisclosureChangeEventDetail = { id: string; expanded: boolean }

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface DocumentEventMap {
    [DISCLOSURE_CHANGE_EVENT]: CustomEvent<DisclosureChangeEventDetail>
  }
}

type Setter = (value: boolean | ((prev: boolean) => boolean)) => void

type UseDisclosureResult = [expanded: boolean, setExpanded: Setter]

/**
 * 同じ `id` で呼ぶとイベント経由で状態が同期される custom hook
 */
export const useDisclosure = (id: string): UseDisclosureResult => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent<DisclosureChangeEventDetail>(DISCLOSURE_CHANGE_EVENT, {
        detail: { id, expanded },
      }),
    )
  }, [expanded, id])

  const handleDisclosureChange = useCallback(
    (e: CustomEvent<DisclosureChangeEventDetail>) => {
      if (id === e.detail.id) {
        setExpanded(e.detail.expanded)
      }
    },
    [id],
  )

  useEffect(() => {
    document.addEventListener(DISCLOSURE_CHANGE_EVENT, handleDisclosureChange)
    return () => {
      document.removeEventListener(DISCLOSURE_CHANGE_EVENT, handleDisclosureChange)
    }
  }, [id, handleDisclosureChange])

  const safeSetExpanded: Setter = useCallback(
    (value) => {
      // DisclosureTrigger と DisclosureContent のレンダリング順序に影響しないように animation frame を待ってから state を更新する
      requestAnimationFrame(() => {
        if (typeof value === 'function') {
          const newValue = value(expanded)
          setExpanded(newValue)
        } else {
          setExpanded(value)
        }
      })
    },
    [expanded],
  )

  return [expanded, safeSetExpanded]
}
