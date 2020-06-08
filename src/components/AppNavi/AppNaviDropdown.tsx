import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { Props as IconProps } from '../Icon'
import { Active, InActiveStyle, getIconComponent } from './appNaviHelper'

export type AppNaviDropdownProps = {
  children: ReactNode
  dropdownContent: ReactNode
  current?: boolean
  icon?: IconProps['name']
}

export const AppNaviDropdown: FC<AppNaviDropdownProps> = ({
  children,
  dropdownContent,
  current,
  icon,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, icon, current)

  if (current) {
    return (
      <Active themes={theme} aria-selected="true">
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <InActive themes={theme}>
          {iconComponent}
          {children}
        </InActive>
      </DropdownTrigger>

      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}

const InActive = styled.button<{ themes: Theme }>`
  ${InActiveStyle}
`
