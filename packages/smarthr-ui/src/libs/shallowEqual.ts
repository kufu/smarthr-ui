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

  const recordA = a as Record<string, unknown>
  const recordB = b as Record<string, unknown>

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(recordA[key], recordB[key])) {
      return false
    }
  }

  return true
}
