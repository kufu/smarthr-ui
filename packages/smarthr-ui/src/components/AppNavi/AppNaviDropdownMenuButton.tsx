import React, {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useMemo,
  useState,
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
    wrapper: ['smarthr-ui-AppNavi-dropdownMenuButton', triggerButton],
    actionList,
  },
})

export const AppNaviDropdownMenuButton: FC<AppNaviDropdownMenuButtonProps> = ({
  children,
  label,
}) => {
  const [hasCurrentPage, setHasCurrentPage] = useState(false)
  const actualChildren = useMemo(
    () =>
      React.Children.map(children, (item, i) => {
        if (React.isValidElement(item) && item.props['aria-current'] === 'page') {
          setHasCurrentPage(true)
        }

        // MEMO: {flag && <Button/>}のような書き方に対応させる為、型を変換する
        // itemの存在チェックでfalsyな値は弾かれている想定
        return item ? <li key={i}>{item as ActionItemTruthyType}</li> : null
      }),
    [children],
  )

  const { wrapper: wrapperStyle, actionList: actionListStyle } = appNaviDropdownMenuButton({
    active: hasCurrentPage,
  })

  return (
    <Dropdown>
      <DropdownTrigger>
        <UnstyledButton className={wrapperStyle()}>
          {label}
          <FaCaretDownIcon />
        </UnstyledButton>
      </DropdownTrigger>
      <DropdownContent>
        <ul className={actionListStyle()}>{actualChildren}</ul>
      </DropdownContent>
    </Dropdown>
  )
}
