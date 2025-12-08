export const shallowEquali = <A = any, B = any>(a: A, b: B): boolean => {
  if (Object.is(a, b)) {
    return true
  }

  if (!a || !b) {
    return false
  }

  if (typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false
    }
    // @ts-expect-error key should be in keyof a and b
    if (!Object.is(a[key], b[key])) {
      return false
    }
  }

  return true
}
