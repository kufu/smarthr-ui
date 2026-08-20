import { useEffect, useMemo, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

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
  const latest = useLatest({ id, expanded })

  const functions = useMemo(
    () => ({
      safeSetExpanded: (value: boolean | ((prev: boolean) => boolean)) => {
        // DisclosureTrigger と DisclosureContent のレンダリング順序に影響しないように animation frame を待ってから state を更新する
        // TODO: cancelする
        requestAnimationFrame(() => {
          const next = typeof value === 'function' ? value(latest.expanded) : value

          if (next !== latest.expanded) {
            setExpanded(next)
            document.dispatchEvent(
              new CustomEvent<DisclosureChangeEventDetail>(DISCLOSURE_CHANGE_EVENT, {
                detail: { id: latest.id, expanded: next },
              }),
            )
          }
        })
      },
      handleDisclosureChange: (e: CustomEvent<DisclosureChangeEventDetail>) => {
        if (latest.id === e.detail.id) {
          setExpanded(e.detail.expanded)
        }
      },
    }),
    [latest],
  )

  useEffect(() => {
    document.addEventListener(DISCLOSURE_CHANGE_EVENT, functions.handleDisclosureChange)

    return () => {
      document.removeEventListener(DISCLOSURE_CHANGE_EVENT, functions.handleDisclosureChange)
    }
  }, [functions])

  return [expanded, functions.safeSetExpanded]
}
