// HINT: モジュールスコープでcreateContextを呼ぶため、react-server条件で評価されると
// TypeErrorになる。上位のAppHeaderが'use client'を持つことで
// clientグラフに入り、サーバ側では評価されない。
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
