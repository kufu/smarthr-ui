import React, {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton, Button, UnstyledButton } from '../Button'
import { RemoteDialogTrigger } from '../Dialog'
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { dropdownMenuButton } from '../Dropdown/DropdownMenuButton/DropdownMenuButton'
import { FaCaretDownIcon } from '../Icon'

import { appNaviItemStyle } from './style'

type AppNaviDropdownMenuButtonProps = PropsWithChildren<{
  /** 引き金となるボタンラベル */
  label: ReactNode
}>

type ActionItemTruthyType =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | ReactElement<ComponentProps<typeof RemoteDialogTrigger>>

const {
  slots: { triggerButton, actionList },
} = dropdownMenuButton
const appNaviDropdownMenuButton = tv({
  extend: appNaviItemStyle,
  slots: {
    wrapper: [
      'smarthr-ui-AppNavi-dropdownMenuButton',
      'has-[[aria-current="page"]]:shr-relative has-[[aria-current="page"]]:shr-text-black',
      'has-[[aria-current="page"]]:after:shr-bottom-0 has-[[aria-current="page"]]:after:shr-inset-x-0 has-[[aria-current="page"]]:after:shr-block has-[[aria-current="page"]]:after:shr-h-0.25 has-[[aria-current="page"]]:after:shr-bg-main has-[[aria-current="page"]]:after:shr-content-[""] has-[[aria-current="page"]]:after:shr-absolute',
      triggerButton,
    ],
    actionList,
  },
})

export const AppNaviDropdownMenuButton: FC<AppNaviDropdownMenuButtonProps> = ({
  children,
  label,
}) => {
  const actualChildren = useMemo(
    () =>
      React.Children.map(children, (item, i) =>
        // MEMO: {flag && <Button/>}のような書き方に対応させる為、型を変換する
        // itemの存在チェックでfalsyな値は弾かれている想定
        item ? <li key={i}>{item as ActionItemTruthyType}</li> : null,
      ),
    [children],
  )

  const { wrapper: wrapperStyle, actionList: actionListStyle } = appNaviDropdownMenuButton()

  return (
    <Dropdown>
      <DropdownTrigger>
        <UnstyledButton className={wrapperStyle()}>
          {label}
          {/* has([aria-current="page"]) を書くために複製 */}
          <span hidden>{actualChildren}</span>
          <FaCaretDownIcon />
        </UnstyledButton>
      </DropdownTrigger>
      <DropdownContent>
        <ul className={actionListStyle()}>{actualChildren}</ul>
      </DropdownContent>
    </Dropdown>
  )
}
