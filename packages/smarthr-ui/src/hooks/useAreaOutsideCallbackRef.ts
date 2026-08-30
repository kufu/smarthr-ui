import { type RefObject, useCallback } from 'react'

import { useCallbackRefCleanupForReact18 } from './useCallbackRefCleanupForReact18'
import { useLatest } from './useLatest'

/**
 * 指定された複数の要素を「ひとつの領域（Area）」とみなし
 * その領域の【外側】がクリックされた際に処理を実行するcallbackRefを生成する。
 * オプションで、領域の【内側】がクリックされたときの処理も指定できます。
 *
 * Comboboxの「入力要素」と、Portal等で生成された「メニュー要素」のように、
 * DOM構造上は離れているが、UIとしては同じ領域として扱いたい複数要素の外側クリックを判定するのに最適です。
 * callbackRefとして設定する要素はメニュー要素のようにdom上に存在する・しないが変更される要素が指定します。
 *
 * @param otherRefs 領域を構成する要素のRef配列。`null` を渡すと処理をスキップします。
 *                  （例: メニューが閉じている間など、監視が不要なタイミングでは明示的に `null` を渡してください）
 * @param onOuter   領域の【外側】がクリックされたときに実行されるメインのコールバック。
 * @param onInner   領域の【内側】がクリックされたときに実行されるオプションのコールバック。
 */
export function useAreaOutsideCallbackRef(
  otherRefs: Array<RefObject<HTMLElement>>,
  onOuter: (e: MouseEvent) => void,
  onInner?: (e: MouseEvent) => void,
) {
  const latest = useLatest({ otherRefs, onOuter, onInner })

  return useCallbackRefCleanupForReact18(
    useCallback(
      (node: HTMLElement | null) => {
        if (!node) {
          return
        }

        const handleClick = (e: MouseEvent) => {
          // TODO: 現在はareaを成立させるotherRefsの要素は常に存在しているが、
          // 対象要素が可変する場合は下記処理を復活させる
          // // 監視対象がない（null）場合は、area不成立とみなしてskip
          // if (!latest.otherRefs) return
          const path = e.composedPath()

          // 領域内のいずれかの要素に含まれているかチェック
          if (
            path.includes(node) ||
            latest.otherRefs.some((target) => target.current && path.includes(target.current))
          ) {
            latest.onInner?.(e)
          } else {
            latest.onOuter(e)
          }
        }

        window.addEventListener('click', handleClick)

        return () => {
          window.removeEventListener('click', handleClick)
        }
      },
      [latest],
    ),
  )
}
