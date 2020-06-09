import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { Props as IconProps } from '../Icon'
import { buttonStyle, getIconComponent } from './appNaviHelper'

export type AppNaviDropdownProps = {
  children: ReactNode
  dropdownContent: ReactNode
  icon?: IconProps['name']
  current?: boolean
  disabled?: boolean
}

export const AppNaviDropdown: FC<AppNaviDropdownProps> = ({
  children,
  dropdownContent,
  icon,
  current,
  disabled,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current, disabled })
  const additionalProps = disabled ? { disabled: true, className: 'disabled' } : {}

  return (
    <Dropdown>
      <DropdownTrigger>
        {current ? (
          <Active themes={theme} aria-selected="true" {...additionalProps}>
            {iconComponent}
            {children}
          </Active>
        ) : (
          <InActive themes={theme} {...additionalProps}>
            {iconComponent}
            {children}
          </InActive>
        )}
      </DropdownTrigger>

      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}

const Active = styled.button<{ themes: Theme }>`
  ${buttonStyle.active}
`
const InActive = styled.button<{ themes: Theme }>`
  ${buttonStyle.inactive}
`
