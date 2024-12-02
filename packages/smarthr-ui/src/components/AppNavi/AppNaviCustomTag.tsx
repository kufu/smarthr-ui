import React, { ComponentType, FC, PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'

import { ComponentProps as IconProps } from '../Icon'

import { appNaviItemStyle } from './style'

export type AppNaviCustomTagProps = PropsWithChildren<{
  /** このボタンのカスタムタグ */
  tag: ComponentType<any>
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
}> & { [key: string]: any }

const appNaviCustomTag = tv({
  extend: appNaviItemStyle,
  slots: {
    wrapper: 'smarthr-ui-AppNavi-customTag',
  },
})

export const AppNaviCustomTag: FC<AppNaviCustomTagProps> = ({
  children,
  tag: Tag,
  icon: Icon,
  current = false,
  className,
  ...props
}) => {
  const { wrapper, icon } = appNaviCustomTag({ active: current })

  return (
    <Tag {...props} aria-current={current ? 'page' : undefined} className={wrapper({ className })}>
      {Icon && <Icon className={icon()} />}
      {children}
    </Tag>
  )
}
