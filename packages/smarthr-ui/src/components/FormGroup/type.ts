import type { Text, TextProps } from '../Text'
import type { ComponentProps, ReactNode } from 'react'

export type IconType = ComponentProps<typeof Text>['icon']

export type ObjectLabelType = {
  text: ReactNode
  /** ラベルの表示タイプ */
  styleType?: TextProps['styleType']
  /** ラベル左に設置するアイコン */
  icon?: IconType
  /** ラベルを視覚的に隠すかどうか */
  unrecommendedHide?: boolean
  /** ラベルを紐づける入力要素のID属性と同じ値 */
  htmlFor?: string
  /** ラベルに適用する `id` 値 */
  id?: string
}
