import React, { Dispatch, createContext } from 'react'

import { Launcher } from '../../types'

export const AppLauncherContext = createContext<{
  features: Array<Launcher['feature']> | null | undefined
  isAppLauncherSelected: boolean
  setIsAppLauncherSelected: Dispatch<React.SetStateAction<boolean>>
}>({
  features: null,
  isAppLauncherSelected: false,
  setIsAppLauncherSelected: () => {},
})
