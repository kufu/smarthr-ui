import React, { ReactNode, VFC } from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { UnstyledButton } from '../Button'
import { ComponentProps as IconProps } from '../Icon'

import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'
import { useClassNames } from './useClassNames'

export type AppNaviButtonProps = {
  /** ボタンのテキスト */
  children: ReactNode
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
  /** クリックイベントのハンドラ */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

type InnerProps = AppNaviButtonProps & {
  isUnclickable?: boolean
}

export const AppNaviButton: VFC<InnerProps> = ({
  children,
  icon,
  current = false,
  isUnclickable = false,
  onClick,
}) => {
  const theme = useTheme()
  const classNames = useClassNames()
  const iconComponent = getIconComponent(theme, { icon, current })

  return (
    <Button
      $themes={theme}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      disabled={isUnclickable}
      type="button"
      className={classNames.button}
      $isActive={current}
      $isUnclickable={isUnclickable}
    >
      {iconComponent}
      {children}
    </Button>
  )
}

const Button = styled(UnstyledButton)<ItemStyleProps>((props) => getItemStyle(props))
