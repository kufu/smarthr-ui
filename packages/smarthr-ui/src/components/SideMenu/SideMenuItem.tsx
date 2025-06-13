import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../Text'

type BaseProps<AsElement extends ElementType> = PropsWithChildren<{
  elementAs?: AsElement
  current?: boolean
  prefix?: ReactNode
}>

type Props<AsElement extends ElementType = 'a'> = BaseProps<AsElement> &
  Omit<ComponentPropsWithoutRef<AsElement>, keyof BaseProps<AsElement>>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-SideMenu-item',
      '[&>a]:shr-block [&>a]:shr-no-underline',
      '[&>*:focus-visible]:shr-focus-indicator',
    ],
    content: [
      'shr-flex shr-items-baseline shr-gap-0.5 shr-p-0.75',
      'aria-current-page:shr-bg-grey-9 aria-current-page:shr-font-bold',
      'hover:shr-bg-head-darken',
    ],
    // 視覚調整のためのtranslate 参考: https://github.com/kufu/smarthr-ui/blob/01d127a4888f5698b2bf17be855ce1e985b575ea/packages/smarthr-ui/src/components/Icon/generateIcon.tsx#L73C81-L73C106
    iconWrapper: ['shr-translate-y-[0.125em] shr-text-grey'],
  },
  variants: {
    current: {
      true: {
        content:
          'shr-border-0 shr-border-s-4 shr-border-solid shr-border-[theme(colors.main)] shr-bg-over-background shr-ps-1.25',
      },
      false: {
        content: 'shr-ps-1.5',
      },
    },
  },
})

export const SideMenuItem = <AsElement extends ElementType = 'a'>({
  elementAs,
  current,
  prefix,
  href,
  children,
  className,
  ...rest
}: Props<AsElement>) => {
  const Component = elementAs ?? 'a'
  const ariaCurrent = useMemo(() => {
    if (!current || !href) {
      return undefined
    }

    return href[0] === '#' ? true : 'page'
  }, [current, href])

  const classNames = useMemo(() => {
    const { wrapper, content, iconWrapper } = classNameGenerator()

    return {
      wrapper: wrapper({ current, className }),
      content: content({ current }),
      iconWrapper: iconWrapper(),
    }
  }, [current, className])

  return (
    <li className={classNames.wrapper}>
      <Component {...rest} href={href} aria-current={ariaCurrent}>
        <Text size="M" leading="TIGHT" className={classNames.content}>
          {prefix && <span className={classNames.iconWrapper}>{prefix}</span>}
          <Text weight={current ? 'bold' : undefined}>{children}</Text>
        </Text>
      </Component>
    </li>
  )
}
