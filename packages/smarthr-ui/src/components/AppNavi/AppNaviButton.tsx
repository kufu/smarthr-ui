import React, { FC, PropsWithChildren, useMemo } from 'react'
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

const appNaviButton = tv({
  extend: appNaviItemStyle,
  slots: {
    wrapper: 'smarthr-ui-AppNavi-button',
  },
})

export const AppNaviButton: FC<AppNaviButtonProps> = ({
  children,
  icon: Icon,
  current = false,
  onClick,
}) => {
  const { wrapperStyle, iconStyle } = useMemo(() => {
    const { wrapper, icon } = appNaviButton({ active: current })
    return {
      wrapperStyle: wrapper(),
      iconStyle: icon(),
    }
  }, [current])

  return (
    <UnstyledButton
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      className={wrapperStyle}
    >
      {Icon && <Icon className={iconStyle} />}
      {children}
    </UnstyledButton>
  )
}
