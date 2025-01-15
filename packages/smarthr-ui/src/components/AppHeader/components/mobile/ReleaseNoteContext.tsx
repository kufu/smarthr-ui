import React, { Dispatch, createContext } from 'react'

import { HeaderProps } from '../../types'

export const ReleaseNoteContext = createContext<{
  releaseNote: HeaderProps['releaseNote']
  isReleaseNoteSelected: boolean
  setIsReleaseNoteSelected: Dispatch<React.SetStateAction<boolean>>
}>({
  releaseNote: null,
  isReleaseNoteSelected: false,
  setIsReleaseNoteSelected: () => {},
})
