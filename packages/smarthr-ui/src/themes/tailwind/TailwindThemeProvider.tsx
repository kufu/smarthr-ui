import React, { PropsWithChildren, createContext } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'

import presetConfig from '../../smarthr-ui-preset'

type PresetConfig = typeof presetConfig

type Props = PropsWithChildren<{
  config?: PresetConfig
}>

export const ThemeContext = createContext<{ config: PresetConfig }>({ config: presetConfig })
export const ThemeProvider: React.FC<Props> = ({ config = presetConfig, children }) => (
  <ThemeContext.Provider value={{ config }}>{children}</ThemeContext.Provider>
)

export const tailwindConfig = resolveConfig(presetConfig)
