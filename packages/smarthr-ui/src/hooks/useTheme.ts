import { useContext } from 'react'

// ThemeProviderを themes/index.ts から export すると、smarthr-ui-preset.ts が themes を import しているため、
// prettier (jiti) がモジュール解決に失敗する。ThemeProvider.tsx から直接 import することで回避。
// eslint-disable-next-line smarthr/require-barrel-import
import { ThemeContext } from '../themes/ThemeProvider'

import type { CreatedTheme } from '../themes'

export type Theme = CreatedTheme

export const useTheme = () => useContext(ThemeContext)
