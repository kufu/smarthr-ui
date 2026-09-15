'use client'

import {
  Children,
  type ComponentProps,
  type FC,
  Fragment,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useCallback,
} from 'react'
import { tv } from 'tailwind-variants'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { DropdownCloser } from '../DropdownCloser'

import type { AnchorButton, Button } from '../../Button'
import type { RemoteDialogTrigger } from '../../Dialog'

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

// HINT: DropdownMenuGroup.tsx側がrenderButtonListに依存しているため、循環依存を避けるために
// コンポーネント参照ではなくDropdownMenuGroupが持つマーカープロパティの有無で判定する
const isDropdownMenuGroupType = (type: ReactElement['type']): boolean =>
  typeof type === 'function' &&
  (type as { __isSmarthrUIDropdownMenuGroup?: boolean }).__isSmarthrUIDropdownMenuGroup === true

export const renderButtonList = (children: Actions) =>
  Children.map(children, (item): ReactNode => {
    if (!item || !isValidElement(item)) {
      return null
    }

    if (item.type === Fragment) {
      return renderButtonList(item.props.children)
    }

    if (isDropdownMenuGroupType(item.type)) {
      return item
    }

    return <ButtonListItem>{item}</ButtonListItem>
  })

const ButtonListItem: FC<{ children: ReactElement }> = ({ children }) => {
  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
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
    }, []),
  )

  return (
    <li ref={callbackRef} role="presentation">
      <DropdownCloser>{children}</DropdownCloser>
    </li>
  )
}
