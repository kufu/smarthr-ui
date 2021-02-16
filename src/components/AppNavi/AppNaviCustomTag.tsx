import React, { ComponentType, ReactNode, VFC } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { IconNames, ComponentProps as IconProps } from '../Icon'
import { getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviCustomTagProps = {
  children: ReactNode
  tag: ComponentType<any>
  icon?: IconNames | React.ComponentType<IconProps>
  current?: boolean
} & { [key: string]: any }
type InnerProps = AppNaviCustomTagProps & {
  isUnclickable?: boolean
}

export const AppNaviCustomTag: VFC<InnerProps> = ({
  children,
  tag,
  icon,
  current = false,
  isUnclickable = false,
  ...props
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current })

  if (current) {
    if (isUnclickable) {
      const unclickableProps = { href: undefined, disabled: true }
      return (
        <UnclickableActive
          as={tag}
          $themes={theme}
          aria-current="page"
          {...props}
          {...unclickableProps}
        >
          {iconComponent}
          {children}
        </UnclickableActive>
      )
    }
    return (
      <Active as={tag} $themes={theme} aria-current="page" {...props}>
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <InActive as={tag} $themes={theme} {...props}>
      {iconComponent}
      {children}
    </InActive>
  )
}

const Active = styled.div<{ $themes: Theme }>(({ $themes }) =>
  getItemStyle({ themes: $themes, isActive: true }),
)
const InActive = styled.div<{ $themes: Theme }>(({ $themes }) => getItemStyle({ themes: $themes }))
const UnclickableActive = styled.div<{ $themes: Theme }>(({ $themes }) =>
  getItemStyle({ themes: $themes, isActive: true, isUnclickable: true }),
)
