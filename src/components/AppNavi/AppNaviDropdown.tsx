import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'

import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { Props as IconProps } from '../Icon'
import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviDropdownProps = {
  children: ReactNode
  dropdownContent: ReactNode
  icon?: IconProps['name']
  current?: boolean
}

type InnerProps = AppNaviDropdownProps & {
  isUnclickable?: boolean
}

export const AppNaviDropdown: FC<InnerProps> = ({
  children,
  dropdownContent,
  icon,
  current = false,
  isUnclickable = false,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current })

  return (
    <Dropdown>
      <DropdownTrigger>
        <TriggerButton
          themes={theme}
          aria-current={current ? 'page' : undefined}
          isActive={current}
          disabled={isUnclickable}
          isUnclickable={isUnclickable}
        >
          {iconComponent}
          {children}
        </TriggerButton>
      </DropdownTrigger>

      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = styled.button<ItemStyleProps>((props) => getItemStyle(props))
