import React, { FC, PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { ComponentProps as IconProps } from '../Icon'

import { appNaviItemStyle } from './style'

export type AppNaviButtonProps = PropsWithChildren<{
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
  /** クリックイベントのハンドラ */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}>
type ElementProps = Omit<React.ComponentPropsWithRef<'button'>, keyof AppNaviButtonProps>

const appNaviButton = tv({
  extend: appNaviItemStyle,
  slots: {
    wrapper: 'smarthr-ui-AppNavi-button',
  },
})

export const AppNaviButton: FC<AppNaviButtonProps & ElementProps> = ({
  children,
  icon: Icon,
  current = false,
  onClick,
  className,
}) => {
  const { wrapper, icon } = appNaviButton({ active: current })

  return (
    <UnstyledButton
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      className={wrapper({ className })}
    >
      {Icon && <Icon className={icon()} />}
      {children}
    </UnstyledButton>
  )
}
