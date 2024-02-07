import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { ComponentProps as IconProps } from '../Icon'

import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'
import { useClassNames } from './useClassNames'

export type AppNaviAnchorProps = {
  /** アンカーのテキスト */
  children: ReactNode
  /** アンカーの href */
  href: string
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
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
  const classNames = useClassNames()
  const iconComponent = getIconComponent(theme, { icon, current })

  return (
    <Anchor
      themes={theme}
      aria-current={current ? 'page' : undefined}
      href={isUnclickable ? undefined : href}
      className={classNames.anchor}
      $isActive={current}
      $isUnclickable={isUnclickable}
    >
      {iconComponent}
      {children}
    </Anchor>
  )
}

const Anchor = styled.a<ItemStyleProps>(
  (props) => css`
    ${getItemStyle(props)}

    @media (forced-colors: active) {
      text-decoration: underline;
    }
  `,
)
