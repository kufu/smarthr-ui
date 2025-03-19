import { type ComponentType, type FC, type PropsWithChildren, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { FaCaretDownIcon, type ComponentProps as IconProps } from '../Icon'

import { itemClassNameGenerator } from './itemClassNameGenerator'

export type AppNaviDropdownProps = PropsWithChildren<{
  /** ドロップダウンのコンテンツ */
  dropdownContent: ReactNode
  /** 表示するアイコンタイプ */
  icon?: ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
  displayCaret?: boolean
}>

const classNameGenerator = tv({
  extend: itemClassNameGenerator,
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
  const classNames = useMemo(() => {
    const { wrapper, icon } = classNameGenerator({ active: current, displayCaret })

    return {
      wrapper: wrapper(),
      icon: icon(),
    }
  }, [current, displayCaret])

  return (
    <Dropdown>
      <DropdownTrigger>
        <UnstyledButton aria-current={current ? 'page' : undefined} className={classNames.wrapper}>
          {Icon && <Icon className={classNames.icon} />}
          {children}
          {displayCaret && <FaCaretDownIcon />}
        </UnstyledButton>
      </DropdownTrigger>
      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}
