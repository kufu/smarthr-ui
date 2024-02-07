import React, { ComponentType, ReactNode, VFC } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { ComponentProps as IconProps } from '../Icon'

import { getIconComponent, getItemStyle } from './appNaviHelper'
import { useClassNames } from './useClassNames'

export type AppNaviCustomTagProps = {
  /** ボタンのテキスト */
  children: ReactNode
  /** このボタンのカスタムタグ */
  tag: ComponentType<any>
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
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
  const classNames = useClassNames()
  const iconComponent = getIconComponent(theme, { icon, current })

  if (current) {
    if (isUnclickable) {
      const unclickableProps = { href: undefined, disabled: true }
      return (
        <UnclickableActive
          {...props}
          {...unclickableProps}
          as={tag}
          $themes={theme}
          aria-current="page"
          className={classNames.customTag}
        >
          {iconComponent}
          {children}
        </UnclickableActive>
      )
    }
    return (
      <Active
        {...props}
        as={tag}
        $themes={theme}
        aria-current="page"
        className={classNames.customTag}
      >
        {iconComponent}
        {children}
      </Active>
    )
  }

  return (
    <InActive {...props} as={tag} $themes={theme} className={classNames.customTag}>
      {iconComponent}
      {children}
    </InActive>
  )
}

const Active = styled.div<{ $themes: Theme }>(({ $themes }) =>
  getItemStyle({ $themes, $isActive: true }),
)
const InActive = styled.div<{ $themes: Theme }>(({ $themes }) => getItemStyle({ $themes }))
const UnclickableActive = styled.div<{ $themes: Theme }>(({ $themes }) =>
  getItemStyle({ $themes, $isActive: true, $isUnclickable: true }),
)
