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
