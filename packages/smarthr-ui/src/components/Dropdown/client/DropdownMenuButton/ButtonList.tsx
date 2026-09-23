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
import { tv } from 'tailwind-variants'

import { useCallbackRefCleanupForReact18 } from '../../../../hooks/client/useCallbackRefCleanupForReact18'
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

const actionListItemButton = tv({
  base: [
    // HINT: 実際にレンダリングされた要素のclassに対して追加されるため、優先度を上げる必要がある
    '[&&]:shr-w-full [&&]:shr-justify-start [&&]:shr-rounded-none [&&]:shr-border-none [&&]:shr-py-0.5 [&&]:shr-font-normal',
    '[&&]:focus-visible:shr-focus-indicator',
  ],
})

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

    return <ButtonListItem>{item}</ButtonListItem>
  })

const itemCallbackRef = (node: HTMLElement | null) => {
  if (!node) {
    return
  }

  const setupButton = () => {
    const button = node.querySelector('button,a')

    if (button) {
      button.setAttribute('role', 'menuitem')
      button.setAttribute(
        'class',
        actionListItemButton({ className: button.getAttribute('class') }),
      )
    }
  }

  setupButton()

  const observer = new MutationObserver(setupButton)
  observer.observe(node, {
    childList: true,
    subtree: true,
    // button要素の disabled / aria-disabled が動的に変化した場合も検知してリスナーを貼り直す
    attributes: true,
    attributeFilter: ['disabled', 'aria-disabled'],
  })

  return () => {
    observer.disconnect()
  }
}

const ButtonListItem: FC<{ children: ReactElement }> = ({ children }) => {
  // TODO: clickableな要素毎にcallbackRefを生成しているが、親のmenu要素で一つにまとめられないか検証する
  // MutationObserverの範囲は広がるが複数生成されるよりメリットがありそう
  const callbackRef = useCallbackRefCleanupForReact18(itemCallbackRef)

  return (
    <li ref={callbackRef} role="presentation">
      <DropdownCloser>{children}</DropdownCloser>
    </li>
  )
}
