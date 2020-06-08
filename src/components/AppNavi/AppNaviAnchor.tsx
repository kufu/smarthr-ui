import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Props as IconProps } from '../Icon'
import { Active, InActiveStyle, getIconComponent } from './appNaviHelper'

export type AppNaviAnchorProps = {
  children: ReactNode
  href: string
  current?: boolean
  icon?: IconProps['name']
}

export const AppNaviAnchor: FC<AppNaviAnchorProps> = ({ children, href, current, icon }) => {
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
    <InActive themes={theme} href={href}>
      {iconComponent}
      {children}
    </InActive>
  )
}

const InActive = styled.a<{ themes: Theme }>`
  ${InActiveStyle}
`
