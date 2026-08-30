// HINT: モジュールスコープでcreateContextを呼ぶため、react-server条件で評価されると
// TypeErrorになる。利用側のコンポーネント（SideNav・SideNavItemButton）が'use client'を持つことで
// clientグラフに入り、サーバ側では評価されない。
import { createContext, useContext } from 'react'

import type { SideNavSizeType } from './SideNavItemButton'

type SideNavContextValue = {
  size: SideNavSizeType
}

const SideNavContext = createContext<SideNavContextValue>({
  size: 'M',
})

export const useSideNavContext = () => useContext(SideNavContext)

export const SideNavProvider = SideNavContext.Provider
