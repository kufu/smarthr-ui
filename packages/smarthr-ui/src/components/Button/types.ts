import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react'

export type BaseProps = PropsWithChildren<{
  /**
   * ボタンの大きさ
   */
  size?: 'default' | 's'
  /**
   * 無効な理由
   */
  disabledDetail?: {
    icon?: FunctionComponent
    message: ReactNode
  }
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
   * `true` のとき、ボタンを正方形にする。
   */
  square?: boolean
  /**
   * `true` のとき、ボタンの `width` を 100% にする。
   */
  wide?: boolean
  /**
   * ボタンのスタイルの種類
   */
  variant?: Variant
  /**
   * 処理が走ってるかどうか
   */
  loading?: boolean
}>

export type Variant = 'primary' | 'secondary' | 'danger' | 'skeleton' | 'text'
