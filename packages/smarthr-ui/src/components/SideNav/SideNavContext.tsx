import { createContext, useContext } from 'react'

import type { SideNavSizeType } from './SideNavItemButton'

type SideNavContextValue = {
  size: SideNavSizeType
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => void
}

const SideNavContext = createContext<SideNavContextValue | undefined>(undefined)

export const useSideNavContext = () => useContext(SideNavContext)

export const SideNavProvider = SideNavContext.Provider
