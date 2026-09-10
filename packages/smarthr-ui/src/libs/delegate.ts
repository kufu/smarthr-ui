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
