import { useId } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

export const useObjectHeading = <T, U>(original: T, callback: (org: Exclude<T, U>) => U) => {
  const temp: U = useObjectAttributes<T, U>(original, callback)
  const id = useId()

  return { ...temp, id }
}
