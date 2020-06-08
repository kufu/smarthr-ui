import React, { FC, ReactNode } from 'react'
import styled, { AnyStyledComponent } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Props as IconProps } from '../Icon'
import { Active, InActiveStyle, getIconComponent } from './appNaviHelper'

export type AppNaviCustomTagProps = {
  children: ReactNode
  tag: AnyStyledComponent
  current?: boolean
  icon?: IconProps['name']
} & {}

export const AppNaviCustomTag: FC<AppNaviCustomTagProps> = ({
  children,
  tag,
  current,
  icon,
  ...props
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, icon, current)
  const InActive = styled(tag)<{ themes: Theme }>`
    ${InActiveStyle}
  `

  if (current) {
    return (
      <Active themes={theme} aria-selected="true">
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <InActive themes={theme} {...props}>
      {iconComponent}
      {children}
    </InActive>
  )
}
