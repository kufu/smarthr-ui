import React, { FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { ComponentProps as IconProps } from '../Icon'

import { itemClassNameGenerator } from './itemClassNameGenerator'

export type AppNaviButtonProps = PropsWithChildren<{
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
  /** クリックイベントのハンドラ */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}>

const classNameGenerator = tv({
  extend: itemClassNameGenerator,
  slots: {
    wrapper: 'smarthr-ui-AppNavi-button',
  },
})

export const AppNaviButton: FC<AppNaviButtonProps> = ({
  children,
  icon: Icon,
  current,
  onClick,
}) => {
  const classNames = useMemo(() => {
    const { wrapper, icon } = classNameGenerator({ active: current })

    return {
      wrapper: wrapper(),
      icon: icon(),
    }
  }, [current])

  return (
    <UnstyledButton
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      className={classNames.wrapper}
    >
      {Icon && <Icon className={classNames.icon} />}
      {children}
    </UnstyledButton>
  )
}
