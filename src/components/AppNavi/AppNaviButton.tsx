import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Props as IconProps } from '../Icon'
import { buttonStyle, getIconComponent } from './appNaviHelper'

export type AppNaviButtonProps = {
  children: ReactNode
  icon?: IconProps['name']
  current?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const AppNaviButton: FC<AppNaviButtonProps> = ({
  children,
  icon,
  current,
  disabled = false,
  onClick,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current, disabled })
  const additionalProps = disabled
    ? {
        disabled,
        className: 'disabled',
      }
    : {
        onClick,
      }

  if (current) {
    return (
      <Active themes={theme} aria-selected="true" {...additionalProps}>
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <InActive themes={theme} {...additionalProps}>
      {iconComponent}
      {children}
    </InActive>
  )
}

const Active = styled.button<{ themes: Theme }>`
  ${buttonStyle.active}
`
const InActive = styled.button<{ themes: Theme }>`
  ${buttonStyle.inactive}
`
