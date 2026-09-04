import { type RefObject, useEffect } from 'react'

import { useLatest } from './useLatest'

/**
 * 指定された複数の要素を「ひとつの領域（Area）」とみなし、その領域の【外側】がクリックされたときにコールバックを実行するフック。
 * オプションで、領域の【内側】がクリックされたときの処理も指定できます。
 *
 * Comboboxの「入力要素」と、Portal等で生成された「メニュー要素」のように、
 * DOM構造上は離れているが、UIとしては同じ領域として扱いたい複数要素の外側クリックを判定するのに最適です。
 *
 * @param targets 領域を構成する要素のRef配列。`null` を渡すと処理をスキップします。
 *                （例: メニューが閉じている間など、監視が不要なタイミングでは明示的に `null` を渡してください）
 * @param onOuter 領域の【外側】がクリックされたときに実行されるメインのコールバック。
 * @param onInner 領域の【内側】がクリックされたときに実行されるオプションのコールバック。
 */
export function useAreaOutsideClick(
  targets: Array<RefObject<HTMLElement>> | null,
  onOuter: (e: MouseEvent) => void,
  onInner?: (e: MouseEvent) => void,
) {
  const latest = useLatest({ targets, onOuter, onInner })

  // TODO: useEffectではなくcallbackRef化したい
  // Comboboxなどでメニューが表示されている場合、といったようにuseEffectで監視し続ける意味が薄いため
  // 対象コンポーネントがマウントされている場合だけ監視するようにするようにする
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // 監視対象がない（null）場合は、area不成立とみなしてskip
      if (!latest.targets) return

      const path = e.composedPath()

      // 領域内のいずれかの要素に含まれているかチェック
      if (latest.targets.some((target) => target.current && path.includes(target.current))) {
        latest.onInner?.(e)
      } else {
        latest.onOuter(e)
      }
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [latest])
}
