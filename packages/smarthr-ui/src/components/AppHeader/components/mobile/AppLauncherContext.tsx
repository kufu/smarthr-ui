import { type Dispatch, type SetStateAction, createContext } from 'react'

import type { Launcher } from '../../types'

export const AppLauncherContext = createContext<{
  features: Array<Launcher['feature']>
  isAppLauncherAvailable: boolean
  featuresLoading: boolean
  featuresError: boolean
  handleOpenAppLauncher: () => void
  isAppLauncherSelected: boolean
  setIsAppLauncherSelected: Dispatch<SetStateAction<boolean>>
}>({
  features: [],
  isAppLauncherAvailable: false,
  featuresLoading: false,
  featuresError: false,
  handleOpenAppLauncher: () => {},
  isAppLauncherSelected: false,
  setIsAppLauncherSelected: () => {},
})
