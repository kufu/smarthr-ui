import { type Dispatch } from 'react'
import { createContext } from 'react'

import { type HeaderProps } from '../../types'

import type React from 'react'

export const ReleaseNoteContext = createContext<{
  releaseNote: HeaderProps['releaseNote']
  isReleaseNoteSelected: boolean
  setIsReleaseNoteSelected: Dispatch<React.SetStateAction<boolean>>
}>({
  releaseNote: null,
  isReleaseNoteSelected: false,
  setIsReleaseNoteSelected: () => {},
})
