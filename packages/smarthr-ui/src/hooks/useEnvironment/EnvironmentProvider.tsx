'use client'

import { type FC, type ReactNode, useContext } from 'react'

import { defaultMediaQuery } from '../../themes/createMediaQuery'
import { useMediaQueries } from '../useMediaQuery'
import { useTheme } from '../useTheme'

import { type Environment, EnvironmentContext } from './useEnvironment'

type Props = {
  children: ReactNode
  environment?: Partial<Environment>
}

export const EnvironmentProvider: FC<Props> = ({ children, environment }) => {
  const theme = useTheme()
  const inheritedEnvironment = useContext(EnvironmentContext)
  const mediaQueries = theme?.mediaQuery ?? defaultMediaQuery
  const matches = useMediaQueries(mediaQueries)
  const state: Environment = {
    mobile: matches.SCREEN_SMALL,
    matches,
    ...inheritedEnvironment,
    ...environment,
  }

  return <EnvironmentContext.Provider value={state}>{children}</EnvironmentContext.Provider>
}
