import React, { type FC, type PropsWithChildren, type ReactElement, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuGroup } from '../Dropdown'
import { DropdownMenuButton } from '../Dropdown/DropdownMenuButton/DropdownMenuButton'

type Props = PropsWithChildren<{
  /** 引き金となるボタンラベル */
  label: ReactNode
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
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:shr-relative',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:shr-text-black',
      ],
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-content-[""]',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-absolute',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-bottom-0',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-inset-x-0',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-h-0.25',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-bg-main',
      ],
    ],
    actionItem: [
      'aria-current-page:shr-bg-grey-9 aria-current-page:shr-font-bold',
      // aria-current-page より詳細度を確実に上げる
      '[&&]:hover:shr-bg-head-darken',
    ],
  },
})
const { trigger, actionItem } = classNameGenerator()

const renderItemList = (children: ReactNode) =>
  React.Children.map(children, (item): ReactNode => {
    if (!React.isValidElement(item)) {
      return null
    }

    if (item.type === React.Fragment) {
      return renderItemList(item.props.children)
    }

    if (item.type === DropdownMenuGroup) {
      return (
        <DropdownMenuGroup {...item.props}>{renderItemList(item.props.children)}</DropdownMenuGroup>
      )
    }

    return React.cloneElement(item as ReactElement, {
      className: actionItem({ className: item.props.className }),
    })
  })

export const AppNaviDropdownMenuButton: FC<Props> = ({ label, children }) => (
  <DropdownMenuButton
    label={
      <>
        {label}
        {/* has([aria-current="page"]) を書くために複製 */}
        <span hidden>{children}</span>
      </>
    }
    className={trigger()}
  >
    {renderItemList(children)}
  </DropdownMenuButton>
)
