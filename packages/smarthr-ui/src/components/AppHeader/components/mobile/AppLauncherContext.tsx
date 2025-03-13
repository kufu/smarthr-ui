import { type Dispatch } from 'react'
import { createContext } from 'react'

import { type Launcher } from '../../types'

import type React from 'react'

export const AppLauncherContext = createContext<{
  features: Array<Launcher['feature']> | null | undefined
  isAppLauncherSelected: boolean
  setIsAppLauncherSelected: Dispatch<React.SetStateAction<boolean>>
}>({
  features: null,
  isAppLauncherSelected: false,
  setIsAppLauncherSelected: () => {},
})
