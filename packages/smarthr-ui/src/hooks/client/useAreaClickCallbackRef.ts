import { type RefObject, useCallback } from 'react'

import { useLatest } from '../useLatest'

import { useCallbackRefCleanupForReact18 } from './useCallbackRefCleanupForReact18'

/**
 * 指定された複数の要素を「ひとつの領域（Area）」とみなし
 * その領域の【外側】がクリックされた際に処理を実行するcallbackRefを生成する。
 * オプションで、領域の【内側】がクリックされたときの処理も指定できます。
 *
 * Comboboxの「入力要素」と、Portal等で生成された「メニュー要素」のように、
 * DOM構造上は離れているが、UIとしては同じ領域として扱いたい複数要素の外側クリックを判定するのに最適です。
 * callbackRefとして設定する要素はメニュー要素のようにdom上に存在する・しないが頻繁に変更される要素を指定する想定です。
 *
 * @param otherRefs 領域を構成する要素のRef配列。
 * @param onOuter   領域の【外側】がクリックされたときに実行されるメインのコールバック。
 * @param onInner   領域の【内側】がクリックされたときに実行されるオプションのコールバック。
 */
export function useAreaClickCallbackRef(
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
          // TODO: 現在はareaを成立させるotherRefsの要素はcallbackRefがmountされている場合、
          // 常にmountされている前提だが、対象要素が可変する場合を考慮して
          // 監視対象が揃っていない場合は、area不成立とみなしてskip
          // callbackRefなので設定されている要素はこのロジックに到達した場合必ず存在するので
          // otherRefsの中身だけチェックする
          const refs = latest.otherRefs

          if (refs.length === 0) return

          const areaEls = refs.reduce<HTMLElement[]>((prev, target) => {
            if (target.current) {
              prev.push(target.current)
            }

            return prev
          }, [])

          if (areaEls.length !== refs.length) return

          const path = e.composedPath()

          // 領域内のいずれかの要素に含まれているかチェック
          // HINT: nodeは頻繁に可変する要素の想定で、Comboboxのメニューなどが該当する
          // そのためユーザーが操作する可能性が高いことが予想されるので先にチェックする
          if (path.includes(node) || areaEls.some((el) => path.includes(el))) {
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
