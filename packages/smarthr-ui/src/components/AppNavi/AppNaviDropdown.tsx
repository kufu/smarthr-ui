import React, { FC, PropsWithChildren, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { FaCaretDownIcon, ComponentProps as IconProps } from '../Icon'

import { appNaviItemStyle } from './style'

export type AppNaviDropdownProps = PropsWithChildren<{
  /** ドロップダウンのコンテンツ */
  dropdownContent: ReactNode
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
  displayCaret?: boolean
}>

const appNaviDropdown = tv({
  extend: appNaviItemStyle,
  variants: {
    displayCaret: {
      true: {
        wrapper: [
          'smarthr-ui-AppNavi-dropdown',
          '[&[aria-expanded="true"]_.smarthr-ui-Icon:last-child]:shr-rotate-180',
        ],
      },
    },
  },
})

export const AppNaviDropdown: FC<AppNaviDropdownProps> = ({
  children,
  dropdownContent,
  icon: Icon,
  current,
  displayCaret,
}) => {
  const styles = useMemo(() => {
    const { wrapper, icon } = appNaviDropdown({ active: current, displayCaret })

    return {
      wrapper: wrapper(),
      icon: icon(),
    }
  }, [current, displayCaret])

  return (
    <Dropdown>
      <DropdownTrigger>
        <UnstyledButton aria-current={current ? 'page' : undefined} className={styles.wrapper}>
          {Icon && <Icon className={styles.icon} />}
          {children}
          {displayCaret && <FaCaretDownIcon />}
        </UnstyledButton>
      </DropdownTrigger>
      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}
