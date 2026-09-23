'use client'

import {
  Children,
  type ComponentProps,
  type FC,
  Fragment,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from 'react'

import { DropdownCloser } from '../../DropdownCloser'

import type { AnchorButton, Button } from '../../../Button'
import type { RemoteDialogTrigger } from '../../../Dialog'

export type Actions = ActionItem | ActionItem[]

// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItem =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | ReactElement<ComponentProps<typeof RemoteDialogTrigger>>
  | ReactNode

// HINT: DropdownMenuGroup.tsx側がButtonListに依存しているため、循環依存を避けるために
// コンポーネント参照ではなくDropdownMenuGroupが持つマーカーの有無で判定する。
// 通常のクライアント側では要素はまだ未レンダーでitem.typeがDropdownMenuGroup関数のままのため
// 関数マーカーで判定するが、DropdownMenuButtonがServer Componentから利用されその子として
// DropdownMenuGroupが渡された場合、DropdownMenuGroupはサーバー側で既にレンダーされたli要素と
// して届く（item.typeは関数ではなく'li'になる）ため、この場合はルート要素に付与された
// data属性で判定する。どちらか一方だけでは判定を取りこぼすため両方必要
const isDropdownMenuGroupType = (item: ReactElement): boolean => {
  if (
    typeof item.type === 'function' &&
    (item.type as { __isSmarthrUIDropdownMenuGroup?: boolean }).__isSmarthrUIDropdownMenuGroup ===
      true
  ) {
    return true
  }

  return (
    (item.props as Record<string, unknown> | null | undefined)?.[
      'data-smarthr-ui-dropdown-menu-group'
    ] === true
  )
}

// HINT: 関数呼び出しの形(旧renderButtonList(children))は、Server ComponentからJSXレンダーされる
// 場合(DropdownMenuGroup.tsx)に「Attempted to call renderButtonList() from the server but
// renderButtonList is on the client」で失敗する。コンポーネントとしてJSXレンダーすれば、
// client referenceとして正しく解決されるため、Server Componentからでも利用できる
export const ButtonList: FC<{ children: Actions }> = ({ children }) =>
  Children.map(children, (item): ReactNode => {
    if (!item || !isValidElement(item)) {
      return null
    }

    if (item.type === Fragment) {
      return <ButtonList>{item.props.children}</ButtonList>
    }

    if (isDropdownMenuGroupType(item)) {
      return item
    }

    return (
      <li role="presentation">
        <DropdownCloser>{item}</DropdownCloser>
      </li>
    )
  })
