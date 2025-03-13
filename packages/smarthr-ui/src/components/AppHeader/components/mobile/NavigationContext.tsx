import { type Dispatch } from 'react'
import { createContext } from 'react'

import { type Navigation, type NavigationGroup } from '../../types'

import type React from 'react'

export const NavigationContext = createContext({
  navigations: [] as Navigation[],
  selectedNavigationGroup: null as NavigationGroup | null,
  setSelectedNavigationGroup: (() => {}) as Dispatch<React.SetStateAction<NavigationGroup | null>>,
})
