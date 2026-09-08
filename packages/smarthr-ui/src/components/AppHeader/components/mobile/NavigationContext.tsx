// HINT: モジュールスコープでcreateContextを呼ぶため、react-server条件で評価されると
// TypeErrorになる。上位のAppHeaderが'use client'を持つことで
// clientグラフに入り、サーバ側では評価されない。
import { type Dispatch, type SetStateAction, createContext } from 'react'

import type { Navigation, NavigationGroup } from '../../types'

export const NavigationContext = createContext({
  navigations: [] as Navigation[],
  selectedNavigationGroup: null as NavigationGroup | null,
  setSelectedNavigationGroup: (() => {}) as Dispatch<SetStateAction<NavigationGroup | null>>,
})
