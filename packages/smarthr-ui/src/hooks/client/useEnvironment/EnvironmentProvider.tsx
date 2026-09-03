'use client'

// HINT: document.ariaNotifyはブラウザでのみ必要なpolyfillで、'use client'を持たないbarrel（src/index.ts）
// でimportするとRSCで評価されうる。EnvironmentProviderはアプリケーションのルートに設置される
// 前提のコンポーネントであり、かつ'use client'を持つためサーバ側では評価されない。この2点から
// ここでimportすることで、ブラウザ環境でのみ確実に読み込まれるようにしている
import '@github/arianotify-polyfill'

import { type FC, type ReactNode, useContext } from 'react'

import { defaultMediaQuery } from '../../../themes'
import { useTheme } from '../../client/useTheme'
import { useMediaQueries } from '../../useMediaQueries'

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
