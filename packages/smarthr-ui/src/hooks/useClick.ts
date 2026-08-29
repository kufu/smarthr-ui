import { type RefObject, useEffect } from 'react'

import { isEventIncludedParent } from '../libs/delegate'

import { useLatest } from './useLatest'

/**
 * クリックがtargetsのいずれかの内側で発生したかどうかでcallbackを振り分けるフック。
 *
 * targetsにnullを渡すと監視自体を行わない。
 * 監視が不要なタイミングでは、要素が未マウントであることに頼らず明示的にnullを渡すこと。
 */
export function useClick(
  targets: Array<RefObject<HTMLElement>> | null,
  innerCallback: (e: MouseEvent) => void,
  outerCallback: (e: MouseEvent) => void,
) {
  const latest = useLatest({ targets, innerCallback, outerCallback })

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!latest.targets) {
        return
      } else if (latest.targets.some((target) => isEventIncludedParent(e, target.current))) {
        latest.innerCallback(e)
      } else {
        latest.outerCallback(e)
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [latest])
}
