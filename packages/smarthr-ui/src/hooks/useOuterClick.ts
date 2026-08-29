import { type RefObject, useEffect } from 'react'

import { isEventIncludedParent } from '../libs/delegate'

import { useLatest } from './useLatest'

/**
 * targetsのいずれの内側でもない位置がクリックされたときにcallbackを実行するフック。
 *
 * targetsにnullを渡すと監視自体を行わない。
 * 監視が不要なタイミングでは、要素が未マウントであることに頼らず明示的にnullを渡すこと。
 */
export function useOuterClick(
  targets: Array<RefObject<HTMLElement>> | null,
  callback: (e: MouseEvent) => void,
) {
  const latest = useLatest({ targets, callback })

  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      if (!latest.targets) {
        return
      } else if (!latest.targets.some((target) => isEventIncludedParent(e, target.current))) {
        latest.callback(e)
      }
    }

    window.addEventListener('click', handleOuterClick)

    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  }, [latest])
}
