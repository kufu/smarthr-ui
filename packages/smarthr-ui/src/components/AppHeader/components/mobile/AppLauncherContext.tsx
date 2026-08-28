// HINT: モジュールスコープでcreateContextを呼ぶため、react-server条件で評価されると
// TypeErrorになる。上位のAppHeaderが'use client'を持つことで
// clientグラフに入り、サーバ側では評価されない。
import { type Dispatch, type SetStateAction, createContext } from 'react'

import type { Launcher } from '../../types'

export const AppLauncherContext = createContext<{
  features: Array<Launcher['feature']> | null | undefined
  isAppLauncherSelected: boolean
  setIsAppLauncherSelected: Dispatch<SetStateAction<boolean>>
}>({
  features: null,
  isAppLauncherSelected: false,
  setIsAppLauncherSelected: () => {},
})
