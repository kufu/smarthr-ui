import { ReactNode, RefObject, VFC, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>) {
  const portalContainer = useRef(document.createElement('div')).current
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const parentElement = parent != null && 'current' in parent ? parent.current : parent
    // SSR を考慮し、useEffect 内で初期値 document.body を指定
    const actualParent = parentElement || document.body
    // 前状態のクリンナップと同ループで処理しないようにタイミングを遅らせる
    setTimeout(() => {
      actualParent.appendChild(portalContainer)
      setIsReady(true)
    })
    return () => {
      setIsReady(false)
      actualParent.removeChild(portalContainer)
    }
  }, [portalContainer, parent])

  const Portal: VFC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      if (!isReady) {
        // コンテナの append が完了するまでは子のライフサイクルを開始させない
        return null
      }
      return createPortal(children, portalContainer)
    },
    [isReady, portalContainer],
  )

  return {
    Portal,
    isReady,
  }
}
