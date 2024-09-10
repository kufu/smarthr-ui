import React, {
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
  ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

type BaseProps<AsElement extends ElementType> = PropsWithChildren<{
  elementAs?: AsElement
  current?: boolean
  prefix?: ReactNode
}>

type Props<AsElement extends ElementType = 'a'> = BaseProps<AsElement> &
  Omit<ComponentPropsWithoutRef<AsElement>, keyof BaseProps<AsElement>>

const sideMenuItem = tv({
  slots: {
    wrapper: [
      'smarthr-ui-SideMenu-item',
      '[&>a]:shr-no-underline [&>a]:shr-block',
      '[&>*:focus-visible]:shr-focus-indicator',
    ],
    content: [
      'shr-flex shr-gap-0.5 shr-p-0.75 shr-items-baseline',
      'aria-current-page:shr-bg-grey-9 aria-current-page:shr-font-bold',
      'hover:shr-bg-head-darken',
    ],
    // 視覚調整のためのtranslate 参考: https://github.com/kufu/smarthr-ui/blob/01d127a4888f5698b2bf17be855ce1e985b575ea/packages/smarthr-ui/src/components/Icon/generateIcon.tsx#L73C81-L73C106
    iconWrapper: ['shr-text-grey shr-translate-y-[0.125em]'],
  },
  variants: {
    current: {
      true: {
        content:
          'shr-ps-1.25 shr-border-[theme(colors.main)] shr-border-0 shr-border-s-4 shr-border-solid shr-bg-over-background',
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
  children,
  className,
  ...rest
}: Props<AsElement>) => {
  const Component = elementAs ?? 'a'
  const { wrapperStyle, contentStyle, iconWrapperStyle } = useMemo(() => {
    const { wrapper, content, iconWrapper } = sideMenuItem()
    return {
      wrapperStyle: wrapper({ current, className }),
      contentStyle: content({ current }),
      iconWrapperStyle: iconWrapper(),
    }
  }, [className, current])

  return (
    <li className={wrapperStyle}>
      <Component {...rest}>
        <Text size="M" leading="TIGHT" className={contentStyle}>
          {prefix && <span className={iconWrapperStyle}>{prefix}</span>}
          <Text weight={current ? 'bold' : undefined}>{children}</Text>
        </Text>
      </Component>
    </li>
  )
}
