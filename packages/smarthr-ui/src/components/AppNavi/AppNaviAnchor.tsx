import React, {
  ComponentPropsWithoutRef,
  ComponentType,
  ElementType,
  FC,
  PropsWithoutRef,
  ReactElement,
  Ref,
  forwardRef,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { ElementRef, ElementRefProps } from '../../types'
import { ComponentProps as IconProps } from '../Icon'

import { appNaviItemStyle } from './style'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof AppNaviAnchorProps<T> & ElementRefProps<T>
>

export type AppNaviAnchorProps<T extends ElementType = 'a'> = {
  /** アンカーの href */
  href?: string
  /** 表示するアイコンタイプ */
  icon?: ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
  /** next/link などのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  elementAs?: T
}

type AppNaviAnchorComponent = <T extends ElementType = 'a'>(
  props: AppNaviAnchorProps<T> & ElementProps<T> & ElementRefProps<T>,
) => ReturnType<FC>

const appNaviAnchor = tv({
  extend: appNaviItemStyle,
  slots: {
    wrapper: ['smarthr-ui-AppNavi-anchor', 'forced-colors:shr-underline'],
  },
})

export const AppNaviAnchor: AppNaviAnchorComponent = forwardRef(
  <T extends ElementType = 'a'>(
    {
      children,
      href,
      icon: Icon,
      current = false,
      elementAs,
      ...others
    }: PropsWithoutRef<AppNaviAnchorProps<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ): ReactElement => {
    const { wrapperStyle, iconStyle } = useMemo(() => {
      const { wrapper, icon } = appNaviAnchor({ active: current })
      return {
        wrapperStyle: wrapper(),
        iconStyle: icon(),
      }
    }, [current])

    const Component = elementAs || 'a'

    return (
      <Component
        {...others}
        ref={ref}
        href={href}
        aria-current={current ? 'page' : undefined}
        className={wrapperStyle}
      >
        {Icon && <Icon className={iconStyle} />}
        {children}
      </Component>
    )
  },
)
