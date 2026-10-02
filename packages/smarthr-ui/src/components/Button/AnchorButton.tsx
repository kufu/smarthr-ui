import { type ComponentPropsWithRef, type ElementType, type ReactElement, useMemo } from 'react'

import { OpenInNewTabIcon } from '../Icon'

import { DisabledReason } from './DisabledReason'
import { AnchorButtonInner } from './client'
import { anchorClassNameGenerator } from './style'

import type { BaseProps as ButtonProps } from './types'

type BaseProps<T extends ElementType> = Omit<ButtonProps, 'variant' | 'disabledReason'> & {
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  elementAs?: T
  // tertiaryはAnchorButtonでは使用不可
  variant?: Exclude<ButtonProps['variant'], 'tertiary'>
  inactiveReason?: ButtonProps['disabledReason']
}
type Props<T extends ElementType> = BaseProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof BaseProps<T>>

export const AnchorButton = <T extends ElementType = 'a'>({
  size = 'M',
  prefix,
  suffix,
  wide = false,
  variant = 'secondary',
  inactiveReason,
  target,
  rel,
  elementAs,
  className,
  children,
  href,
  ...rest
}: Props<T>): ReactElement => {
  const classNames = useMemo(() => {
    const { wrapper, inner } = anchorClassNameGenerator()

    return {
      wrapper: wrapper({ variant, size, wide, className }),
      inner: inner({ size }),
    }
  }, [variant, size, wide, className])

  // target="_blank" だが OpenInNewTabIcon を表示したくない場合 suffix に null を指定すれば表示しないようにしている
  const actualSuffix =
    target === '_blank' && !prefix && suffix === undefined ? <OpenInNewTabIcon /> : suffix

  const Component = elementAs || 'a'

  const button = (
    <Component
      {...rest}
      href={href}
      target={target}
      rel={rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel}
      className={classNames.wrapper}
    >
      {prefix}
      <AnchorButtonInner className={classNames.inner} prefix={prefix} suffix={actualSuffix}>
        {children}
      </AnchorButtonInner>
      {actualSuffix}
    </Component>
  )

  if (!href && inactiveReason) {
    return <DisabledReason disabledReason={inactiveReason} button={button} />
  }

  return button
}

// BottomFixedArea での判定に用いるために displayName を明示的に設定する
AnchorButton.displayName = 'AnchorButton'
