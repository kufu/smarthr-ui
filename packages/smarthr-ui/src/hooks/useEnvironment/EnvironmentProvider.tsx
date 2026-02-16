'use client'

import { type FC, type ReactNode, useContext } from 'react'

import { defaultMediaQuery } from '../../themes/createMediaQuery'
import { useMediaQueries } from '../useMediaQueries'
import { useTheme } from '../useTheme'

import { type Environment, EnvironmentContext } from './useEnvironment'

type Props = {
  children: ReactNode
  environment?: Partial<Environment>
}

export const EnvironmentProvider: FC<Props> = ({ children, environment }) => {
  const theme = useTheme()
  const inheritedEnvironment = useContext(EnvironmentContext)
  const matches = useMediaQueries(theme?.mediaQuery ?? defaultMediaQuery)

  const baseEnvironment = {
    ...inheritedEnvironment,
    ...environment,
  }

  const state: Environment = {
    ...baseEnvironment,
    mobile: baseEnvironment.mobile ?? matches.SCREEN_SMALL,
    matches: baseEnvironment.matches ?? matches,
  }

  return <EnvironmentContext.Provider value={state}>{children}</EnvironmentContext.Provider>
}
