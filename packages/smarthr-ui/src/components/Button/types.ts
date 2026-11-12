import type { FunctionComponent, ReactNode } from 'react'

export type ObjectDisabledReasonType = {
  icon?: FunctionComponent
  text: ReactNode
}

export type BaseProps = {
  /**
   * ボタンの大きさ
   */
  size?: 'M' | 'S'
  /**
   * 無効な理由。ReactNodeを直接指定した場合はtextとして扱われる
   */
  disabledReason?: ReactNode | ObjectDisabledReasonType
  /**
   * ボタン内の先頭に表示する内容。
   * 通常は、アイコンを表示するために用いる。
   */
  prefix?: ReactNode
  /**
   * ボタン内の末尾に表示する内容。
   * 通常は、アイコンを表示するために用いる。
   */
  suffix?: ReactNode
  /**
   * `true` のとき、ボタンの `width` を 100% にする。
   */
  wide?: boolean
  /**
   * ボタンのスタイルの種類
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'skeleton' | 'text'
  /**
   * 処理が走ってるかどうか
   */
  loading?: boolean
}
