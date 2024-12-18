import React, { Dispatch, createContext } from 'react'

import { Navigation, NavigationGroup } from '../../types'

export const NavigationContext = createContext({
  navigations: [] as Navigation[],
  selectedNavigationGroup: null as NavigationGroup | null,
  setSelectedNavigationGroup: (() => {}) as Dispatch<React.SetStateAction<NavigationGroup | null>>,
})
