'use client'

import { isMacOS, isiOS } from '@tiptap/core'
import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

let cachedIsApple: boolean | undefined

// isiOS は navigator の有無を確かめずに参照するため、navigator の無い環境では例外になる。先に止める
const getSnapshot = () => {
  cachedIsApple ??= typeof navigator !== 'undefined' && (isiOS() || isMacOS())

  return cachedIsApple
}

// サーバーでは navigator を参照できない。ハイドレーションの不一致を避けるため非 Apple（Ctrl 表記）にそろえる
const getServerSnapshot = () => false

/**
 * Mod を ⌘ と Ctrl のどちらで表示するかの判定。
 *
 * 判定条件は @tiptap/core の normalizeKeyName が Mod を Meta / Control の
 * どちらに解決するかと同一。同じ関数を使うことで、表示と実際のキーバインドが
 * 必ず一致する。独自に判定すると Tiptap と食い違ったときに嘘の表示になる。
 *
 * マウント後の useEffect で補正しない。呼び出す部品（ツールバーのボタンなど）が多く、
 * クライアントで描画するたびに、Apple の環境では全部がマウント直後にもう一度描画されるため。
 * SSR からのハイドレーションでは、サーバーの値との差を埋めるため1回は描画し直す
 */
export const useIsApplePlatform = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
