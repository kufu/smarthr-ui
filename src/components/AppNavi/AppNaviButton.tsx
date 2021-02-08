import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'

import { IconNames, ComponentProps as IconProps } from '../Icon'
import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviButtonProps = {
  children: ReactNode
  icon?: IconNames | React.ComponentType<IconProps>
  current?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

type InnerProps = AppNaviButtonProps & {
  isUnclickable?: boolean
}

export const AppNaviButton: FC<InnerProps> = ({
  children,
  icon,
  current = false,
  isUnclickable = false,
  onClick,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current })

  return (
    <Button
      themes={theme}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      isActive={current}
      disabled={isUnclickable}
      isUnclickable={isUnclickable}
      type="button"
    >
      {iconComponent}
      {children}
    </Button>
  )
}

const Button = styled.button<ItemStyleProps>((props) => getItemStyle(props))
