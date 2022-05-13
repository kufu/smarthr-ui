export type BaseProps = {
  /**
   * ボタンの大きさ
   */
  size?: 'default' | 's'
  /**
   * ボタン内に表示する内容
   */
  children?: React.ReactNode
  /**
   * コンポーネントに適用するクラス名
   */
  className?: string
  /**
   * ボタン内の先頭に表示する内容。
   * 通常は、アイコンを表示するために用いる。
   */
  prefix?: React.ReactNode
  /**
   * ボタン内の末尾に表示する内容。
   * 通常は、アイコンを表示するために用いる。
   */
  suffix?: React.ReactNode
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
}

export type Variant = 'primary' | 'secondary' | 'danger' | 'skeleton' | 'text'
