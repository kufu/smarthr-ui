import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type PropsWithoutRef,
  type ReactElement,
  type Ref,
  forwardRef,
  useMemo,
} from 'react'

import { OpenInNewTabIcon } from '../Icon'

import { DisabledReason } from './DisabledReason'
import { ActualAnchorButton } from './client'
import { commonClassNameGenerator } from './style'

import type { BaseProps as ButtonProps } from './types'
import type { ElementRef, ElementRefProps } from '../../types'

type BaseProps<T extends ElementType> = Omit<ButtonProps, 'variant' | 'disabledReason'> & {
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  elementAs?: T
  // tertiaryはAnchorButtonでは使用不可
  variant?: Exclude<ButtonProps['variant'], 'tertiary'>
  inactiveReason?: ButtonProps['disabledReason']
}

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof BaseProps<T> & ElementRefProps<T>
>

const AnchorButton = forwardRef(
  <T extends ElementType = 'a'>(
    {
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
    }: PropsWithoutRef<BaseProps<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ): ReactElement => {
    const classNames = useMemo(() => {
      const { anchor, inner } = commonClassNameGenerator()

      return {
        wrapper: anchor({
          variant,
          size,
          wide,
          className: `smarthr-ui-AnchorButton ${className || ''}`,
        }),
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
        ref={ref}
        href={href}
        target={target}
        rel={rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel}
        className={classNames.wrapper}
      >
        {prefix}
        <ActualAnchorButton className={classNames.inner} prefix={prefix} suffix={actualSuffix}>
          {children}
        </ActualAnchorButton>
        {actualSuffix}
      </Component>
    )

    if (!href && inactiveReason) {
      return <DisabledReason disabledReason={inactiveReason} button={button} />
    }

    return button
  },
)

// 型キャストなしで ForwardRefExoticComponent に合わせた型をエクスポートするための処理
type AnchorButtonType = <T extends ElementType = 'a'>(
  props: BaseProps<T> & ElementProps<T> & ElementRefProps<T>,
) => ReturnType<FC>

const ForwardedAnchorButton = AnchorButton as unknown as AnchorButtonType & {
  displayName: string
}

// BottomFixedArea での判定に用いるために displayName を明示的に設定する
ForwardedAnchorButton.displayName = 'AnchorButton'

export { ForwardedAnchorButton as AnchorButton }
