export const shallowEqual = <A = any, B = any>(a: A, b: B): boolean => {
  if (Object.is(a, b)) {
    return true
  }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      // @ts-expect-error key should be in keyof a and b
      !Object.is(a[key], b[key])
    ) {
      return false
    }
  }

  return true
}
