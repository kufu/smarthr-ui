import React, { ReactNode, VFC } from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'

import { IconNames, ComponentProps as IconProps } from '../Icon'
import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviAnchorProps = {
  children: ReactNode
  href: string
  icon?: IconNames | React.ComponentType<IconProps>
  current?: boolean
}
type InnerProps = AppNaviAnchorProps & {
  isUnclickable?: boolean
}

export const AppNaviAnchor: VFC<InnerProps> = ({
  children,
  href,
  icon,
  current = false,
  isUnclickable = false,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current })

  return (
    <Anchor
      themes={theme}
      aria-current={current ? 'page' : undefined}
      href={isUnclickable ? undefined : href}
      isActive={current}
      isUnclickable={isUnclickable}
    >
      {iconComponent}
      {children}
    </Anchor>
  )
}

const Anchor = styled.a<ItemStyleProps>((props) => getItemStyle(props))
