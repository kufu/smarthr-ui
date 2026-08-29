export const findDelegateTarget = <T extends Element>(
  e: { nativeEvent: Event },
  selector: string,
): T | null => {
  for (const el of e.nativeEvent.composedPath()) {
    if (el instanceof Element && el.matches(selector)) {
      return el as T
    }
  }
  return null
}

/**
 * イベントの伝播経路に指定の要素が含まれるかを判定する。
 * e.targetではなくcomposedPathを見ることで、実際に伝播した経路のみを対象にする。
 */
export const isEventIncludedParent = (e: MouseEvent, parent: Element | null): boolean => {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return path.includes(parent)
}
