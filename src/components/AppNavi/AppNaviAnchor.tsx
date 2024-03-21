import React, { FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { ComponentProps as IconProps } from '../Icon'

import { appNaviItemStyle } from './style'

export type AppNaviAnchorProps = PropsWithChildren<{
  /** アンカーの href */
  href: string
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
}>

const appNaviAnchor = tv({
  extend: appNaviItemStyle,
  slots: {
    wrapper: ['smarthr-ui-AppNavi-anchor', 'forced-colors:shr-underline'],
  },
})

export const AppNaviAnchor: FC<AppNaviAnchorProps> = ({
  children,
  href,
  icon: Icon,
  current = false,
}) => {
  const clickable = !current
  const { wrapperStyle, iconStyle } = useMemo(() => {
    const { wrapper, icon } = appNaviAnchor({ active: current })
    return {
      wrapperStyle: wrapper(),
      iconStyle: icon(),
    }
  }, [current])

  return (
    <a
      aria-current={current ? 'page' : undefined}
      href={clickable ? href : undefined}
      className={wrapperStyle}
    >
      {Icon && <Icon className={iconStyle} />}
      {children}
    </a>
  )
}
