import { useEffect, useState } from 'react'

import { defaultBreakpoint } from '../../themes/createBreakpoint'

const mediaQuery = {
  narrow: `(max-width: ${defaultBreakpoint.NARROW})`,
}

export const useDevice = () => {
  const [isNarrowView, setIsNarrowView] = useState(matchMedia(mediaQuery.narrow).matches)
  const handleChange = (e: MediaQueryListEvent) => {
    setIsNarrowView(e.matches)
  }

  useEffect(() => {
    const matchQueryList = matchMedia(mediaQuery.narrow)

    matchQueryList.addEventListener('change', handleChange)

    return () => {
      matchQueryList.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    isNarrowView,
  }
}
