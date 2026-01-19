import {
  Children,
  type FC,
  Fragment,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuGroup } from '../Dropdown'
import { DropdownMenuButton } from '../Dropdown/DropdownMenuButton/DropdownMenuButton'

type Props = PropsWithChildren<{
  /** 引き金となるボタンラベル */
  label: ReactNode
  onOpen?: () => void
  onClose?: () => void
}>

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppNavi-dropdownMenuButton',
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-border-none',
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.5',
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-text-grey',
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-rounded-none',
      ],
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:shr-relative',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:shr-text-black',
      ],
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-content-[""]',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-absolute',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-bottom-0',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-inset-x-0',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-h-0.25',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-bg-main',
      ],
    ],
    actionItem: [
      '[&&]:aria-current-page:shr-bg-grey-9 [&&]:aria-current-page:shr-font-bold',
      // aria-current-page より詳細度を確実に上げる
      '[&&]:hover:shr-bg-head-darken',
    ],
  },
})
const { trigger, actionItem } = classNameGenerator()

const renderItemList = (children: ReactNode) =>
  Children.map(children, (item): ReactNode => {
    if (!isValidElement(item)) {
      return null
    }

    if (item.type === Fragment) {
      return renderItemList(item.props.children)
    }

    if (item.type === DropdownMenuGroup) {
      return (
        <DropdownMenuGroup {...item.props}>{renderItemList(item.props.children)}</DropdownMenuGroup>
      )
    }

    return cloneElement(item as ReactElement, {
      className: actionItem({ className: item.props.className }),
    })
  })

export const AppNaviDropdownMenuButton: FC<Props> = ({ label, onOpen, onClose, children }) => (
  <DropdownMenuButton
    trigger={
      <>
        {label}
        {/* has([aria-current="page"]) を書くために複製 */}
        <span hidden>{children}</span>
      </>
    }
    onOpen={onOpen}
    onClose={onClose}
    className={trigger()}
  >
    {renderItemList(children)}
  </DropdownMenuButton>
)
