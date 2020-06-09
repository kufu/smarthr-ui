import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Props as IconProps } from '../Icon'
import { buttonStyle, getIconComponent } from './appNaviHelper'

export type AppNaviAnchorProps = {
  children: ReactNode
  href: string
  icon?: IconProps['name']
  current?: boolean
  disabled?: boolean
}

export const AppNaviAnchor: FC<AppNaviAnchorProps> = ({
  children,
  href,
  icon,
  current,
  disabled = false,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current, disabled })
  const additional = disabled ? { className: 'disabled' } : { href }

  if (current) {
    return (
      <Active themes={theme} aria-selected="true" {...additional}>
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <InActive themes={theme} {...additional}>
      {iconComponent}
      {children}
    </InActive>
  )
}

const Active = styled.a<{ themes: Theme }>`
  ${buttonStyle.active}
`
const InActive = styled.a<{ themes: Theme }>`
  ${buttonStyle.inactive}
`
