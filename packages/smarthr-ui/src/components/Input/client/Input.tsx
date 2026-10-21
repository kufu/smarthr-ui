'use client'

import { useEnvironment } from '../../../hooks/client/useEnvironment'

import { DesktopDateInput } from './DesktopDateInput'
import { NativeInput } from './NativeInput'

import type { Props } from './type'
import type { FC } from 'react'

// HINT: type="date"はネイティブUIの実害(コピペ不可、Chromeでの年6桁入力、ブラウザ間のUI差異)が大きいため、
// モバイル以外ではDesktopDateInput(WarekiPicker相当のカレンダーUI)へ内部的に切り替える。
// モバイルはネイティブUIの方が使いやすいため、従来通りNativeInputを使う
export const Input: FC<Props> = (props) => {
  const { mobile } = useEnvironment()

  if (props.type === 'date' && !mobile) {
    return <DesktopDateInput {...props} />
  }

  return <NativeInput {...props} />
}
