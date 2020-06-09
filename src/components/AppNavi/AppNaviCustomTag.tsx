import React, { FC, ReactNode } from 'react'
import styled, { AnyStyledComponent } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Props as IconProps } from '../Icon'
import { buttonStyle, getIconComponent } from './appNaviHelper'

export type AppNaviCustomTagProps = {
  children: ReactNode
  tag: AnyStyledComponent
  icon?: IconProps['name']
  current?: boolean
  disabled?: boolean
} & {}

export const AppNaviCustomTag: FC<AppNaviCustomTagProps> = ({
  children,
  tag,
  icon,
  current,
  disabled = false,
  ...props
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current, disabled })
  const additionalProps = disabled ? { disabled: true, className: 'disabled' } : {}

  const Active = styled(tag)<{ themes: Theme }>`
    ${buttonStyle.active}
  `
  const InActive = styled(tag)<{ themes: Theme }>`
    ${buttonStyle.inactive}
  `

  if (current) {
    return (
      <Active themes={theme} aria-selected="true" {...additionalProps}>
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <InActive themes={theme} {...props} {...additionalProps}>
      {iconComponent}
      {children}
    </InActive>
  )
}
