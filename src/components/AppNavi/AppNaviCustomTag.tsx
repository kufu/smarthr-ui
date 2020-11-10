import React, { ComponentType, FC, ReactNode } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Props as IconProps } from '../Icon'
import { getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviCustomTagProps = {
  children: ReactNode
  tag: ComponentType<any>
  icon?: IconProps['name']
  current?: boolean
} & { [key: string]: any }
type InnerProps = AppNaviCustomTagProps & {
  isUnclickable?: boolean
}

export const AppNaviCustomTag: FC<InnerProps> = ({
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
