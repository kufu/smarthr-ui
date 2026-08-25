import type { Gap } from '../../types'
import type { StatusLabel } from '../StatusLabel'
import type { Text, TextProps } from '../Text'
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  FunctionComponentElement,
  PropsWithChildren,
  ReactNode,
} from 'react'

export type IconType = ComponentProps<typeof Text>['icon']
export type StatusLabelType = FunctionComponentElement<ComponentProps<typeof StatusLabel>>

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

type BaseCommonProps = PropsWithChildren<{
  /** タイトル右の領域 */
  subActionArea?: ReactNode
  /** タイトル群と子要素の間の間隔調整用（基本的には不要） */
  innerMargin?: Gap
  /** タイトルの隣に表示する `StatusLabel` の配列 */
  statusLabels?: StatusLabelType | StatusLabelType[]
  /** タイトルの下に表示するヘルプメッセージ */
  helpMessage?: ReactNode
  /** タイトルの下に表示する入力例 */
  exampleMessage?: ReactNode
  /** タイトルの下に表示するエラーメッセージ */
  errorMessages?: ReactNode | ReactNode[]
  /** エラーがある場合に自動的に入力要素を error にするかどうか */
  autoBindErrorInput?: boolean
  /** フォームコントロールの下に表示する補足メッセージ */
  supplementaryMessage?: ReactNode
}>
export type CommonProps = BaseCommonProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof BaseCommonProps | 'aria-labelledby'>
