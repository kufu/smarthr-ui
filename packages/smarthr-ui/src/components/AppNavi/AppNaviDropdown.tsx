import {
  type ComponentPropsWithRef,
  type ComponentType,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { FaCaretDownIcon, type generateIcon } from '../Icon'

import { itemClassNameGenerator } from './itemClassNameGenerator'

type IconProps = ComponentPropsWithRef<ReturnType<typeof generateIcon>>

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
    const { wrapper, icon } = classNameGenerator({ active: current })

    return {
      wrapper: wrapper({ displayCaret }),
      icon: icon(),
    }
  }, [current, displayCaret])

  return (
    <Dropdown>
      <DropdownTrigger>
        <UnstyledButton className={classNames.wrapper} aria-current={current ? 'page' : undefined}>
          {Icon && <Icon className={classNames.icon} />}
          {children}
          {displayCaret && <FaCaretDownIcon />}
        </UnstyledButton>
      </DropdownTrigger>
      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}
