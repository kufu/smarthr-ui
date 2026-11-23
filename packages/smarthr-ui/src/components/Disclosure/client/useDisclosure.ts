import { useMemo, useState } from 'react'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useLatest } from '../../../hooks/useLatest'

const DISCLOSURE_CHANGE_EVENT = 'smarthr-ui:disclosure-change'
type DisclosureChangeEventDetail = { id: string; expanded: boolean }

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface DocumentEventMap {
    [DISCLOSURE_CHANGE_EVENT]: CustomEvent<DisclosureChangeEventDetail>
  }
}

type Setter = (value: boolean | ((prev: boolean) => boolean)) => void

type UseDisclosureResult = [
  expanded: boolean,
  setExpanded: Setter,
  addDisclosureChangeListener: () => () => void,
  notifyDisclosureChange: () => void,
]

/**
 * 同じ `id` で呼ぶとイベント経由で状態が同期される custom hook
 *
 * @param initialExpanded 初回の開閉状態。animation frame を待たずに state の初期値として反映する
 */
export const useDisclosure = (id: string, initialExpanded = false): UseDisclosureResult => {
  const [expanded, setExpanded] = useState(initialExpanded)
  const frame = useAnimationFrame()
  const latest = useLatest({ id, expanded, frame })

  const functions = useMemo(
    () => ({
      addDisclosureChangeListener: () => {
        document.addEventListener(DISCLOSURE_CHANGE_EVENT, functions.handleDisclosureChange)

        return () => {
          latest.frame.cancel()
          document.removeEventListener(DISCLOSURE_CHANGE_EVENT, functions.handleDisclosureChange)
        }
      },
      // 現在の開閉状態を同じ id の hook に伝える。初期値で開いた状態を DisclosureTrigger などに同期するために使う
      notifyDisclosureChange: () => {
        document.dispatchEvent(
          new CustomEvent<DisclosureChangeEventDetail>(DISCLOSURE_CHANGE_EVENT, {
            detail: { id: latest.id, expanded: latest.expanded },
          }),
        )
      },
      safeSetExpanded: (value: boolean | ((prev: boolean) => boolean)) => {
        // DisclosureTrigger と DisclosureContent のレンダリング順序に影響しないように animation frame を待ってから state を更新する
        latest.frame.request(() => {
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

  return [
    expanded,
    functions.safeSetExpanded,
    functions.addDisclosureChangeListener,
    functions.notifyDisclosureChange,
  ]
}
