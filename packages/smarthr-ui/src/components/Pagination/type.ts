import type { ElementType, MouseEvent } from 'react'

type ButtonOnClickType = (pageNumber: number, e: MouseEvent<HTMLElement>) => void
type AnchorOnClickType = (href: string, e: MouseEvent<HTMLElement>) => void
type HrefTemplateType = (pageNumber: number) => string

export type ButtonProps = {
  /** ボタンを押下したときに発火するコールバック関数 */
  onClick: ButtonOnClickType
  /** href属性生成用関数。設定した場合、番号やarrowがbuttonからa要素に置き換わります */
  hrefTemplate?: undefined
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  linkAs?: undefined
}
export type AnchorProps = {
  /** リンクを押下したときに発火するコールバック関数 */
  onClick?: AnchorOnClickType
  /** href属性生成用関数。設定した場合、番号やarrowがbuttonからa要素に置き換わります */
  hrefTemplate: HrefTemplateType
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  linkAs?: ElementType
}

export type ClickableProps = {
  onDelegateClick?: ButtonOnClickType | AnchorOnClickType
  hrefTemplate?: HrefTemplateType
  linkAs?: ElementType
}
