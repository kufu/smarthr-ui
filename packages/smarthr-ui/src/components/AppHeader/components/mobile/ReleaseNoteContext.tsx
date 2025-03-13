import { type Dispatch, type SetStateAction, createContext } from 'react'

import type { HeaderProps } from '../../types'

export const ReleaseNoteContext = createContext<{
  releaseNote: HeaderProps['releaseNote']
  isReleaseNoteSelected: boolean
  setIsReleaseNoteSelected: Dispatch<SetStateAction<boolean>>
}>({
  releaseNote: null,
  isReleaseNoteSelected: false,
  setIsReleaseNoteSelected: () => {},
})
