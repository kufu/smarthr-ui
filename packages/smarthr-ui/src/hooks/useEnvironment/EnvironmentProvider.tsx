'use client'

import { defaultMediaQuery } from '../../themes/createMediaQuery'
import { useMediaQueries } from '../useMediaQuery'
import { useTheme } from '../useTheme'

import { type Environment, EnvironmentContext } from './useEnvironment'

import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
  environment?: Partial<Environment>
}

export const EnvironmentProvider: FC<Props> = ({ children, environment }) => {
  const theme = useTheme()
  const mediaQueries = theme?.mediaQuery ?? defaultMediaQuery
  const matches = useMediaQueries(mediaQueries)
  const state: Environment = {
    mobile: matches.SCREEN_SMALL,
    matches,
    ...environment,
  }

  return <EnvironmentContext.Provider value={state}>{children}</EnvironmentContext.Provider>
}
