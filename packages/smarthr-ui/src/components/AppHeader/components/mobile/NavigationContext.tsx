import { type Dispatch, type SetStateAction, createContext } from 'react'

import type { Navigation, NavigationGroup } from '../../types'

export const NavigationContext = createContext({
  navigations: [] as Navigation[],
  selectedNavigationGroup: null as NavigationGroup | null,
  setSelectedNavigationGroup: (() => {}) as Dispatch<SetStateAction<NavigationGroup | null>>,
})
