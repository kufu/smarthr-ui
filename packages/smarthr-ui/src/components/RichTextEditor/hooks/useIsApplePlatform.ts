'use client'

import { isMacOS, isiOS } from '@tiptap/core'
import { useEffect, useState } from 'react'

/**
 * Mod を ⌘ と Ctrl のどちらで表示するかの判定。
 *
 * 判定条件は @tiptap/core の normalizeKeyName が Mod を Meta / Control の
 * どちらに解決するかと同一。同じ関数を使うことで、表示と実際のキーバインドが
 * 必ず一致する。独自に判定すると Tiptap と食い違ったときに嘘の表示になる。
 *
 * SSR では navigator を参照できないため、初期値は非 Apple（Ctrl 表記）とし、
 * マウント後に補正する。初期描画を固定値にすることでハイドレーション不一致を避ける。
 */
export const useIsApplePlatform = (): boolean => {
  const [isApple, setIsApple] = useState(false)

  useEffect(() => {
    setIsApple(isiOS() || isMacOS())
  }, [])

  return isApple
}
