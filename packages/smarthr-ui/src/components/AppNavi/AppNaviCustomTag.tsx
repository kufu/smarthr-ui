import React, { type ComponentType, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type ComponentProps as IconProps } from '../Icon'

import { itemClassNameGenerator } from './itemClassNameGenerator'

export type AppNaviCustomTagProps = PropsWithChildren<{
  /** このボタンのカスタムタグ */
  tag: ComponentType<any>
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
}> & { [key: string]: any }

const classNameGenerator = tv({
  extend: itemClassNameGenerator,
  slots: {
    wrapper: 'smarthr-ui-AppNavi-customTag',
  },
})

export const AppNaviCustomTag: FC<AppNaviCustomTagProps> = ({
  children,
  tag: Tag,
  icon: Icon,
  current,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { wrapper, icon } = classNameGenerator({ active: current })

    return {
      wrapper: wrapper(),
      icon: icon(),
    }
  }, [current])

  return (
    <Tag {...props} aria-current={current ? 'page' : undefined} className={classNames.wrapper}>
      {Icon && <Icon className={classNames.icon} />}
      {children}
    </Tag>
  )
}
