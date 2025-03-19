import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ElementType,
  type FC,
  type PropsWithoutRef,
  type ReactElement,
  type Ref,
  forwardRef,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { itemClassNameGenerator } from './itemClassNameGenerator'

import type { ElementRef, ElementRefProps } from '../../types'
import type { ComponentProps as IconProps } from '../Icon'

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

const classNameGenerator = tv({
  extend: itemClassNameGenerator,
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
      current,
      elementAs,
      ...others
    }: PropsWithoutRef<AppNaviAnchorProps<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ): ReactElement => {
    const classNames = useMemo(() => {
      const { wrapper, icon } = classNameGenerator({ active: current })

      return {
        wrapper: wrapper(),
        icon: icon(),
      }
    }, [current])

    const Component = elementAs || 'a'

    return (
      <Component
        {...others}
        ref={ref}
        href={href}
        aria-current={current ? 'page' : undefined}
        className={classNames.wrapper}
      >
        {Icon && <Icon className={classNames.icon} />}
        {children}
      </Component>
    )
  },
)
