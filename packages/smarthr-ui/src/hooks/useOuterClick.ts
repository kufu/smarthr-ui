import { type RefObject, useEffect } from 'react'

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
  innerCallback?: (e: MouseEvent) => void,
) {
  const latest = useLatest({ targets, callback, innerCallback })

  // TODO: useEffectではなくcallbackRef化したい
  // Comboboxなどでメニューが表示されている場合、といったようにuseEffectで監視し続ける意味が薄いため
  // 対象コンポーネントがマウントされている場合だけ監視するようにするようにする
  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      if (latest.targets) {
        const path = e.composedPath()

        if (latest.targets.some((target) => target.current && path.includes(target.current))) {
          latest.innerCallback?.(e)
        } else {
          latest.callback(e)
        }
      }
    }

    window.addEventListener('click', handleOuterClick)

    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  }, [latest])
}
