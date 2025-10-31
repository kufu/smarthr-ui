'use client'

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
import { tv } from 'tailwind-variants'

import { OpenInNewTabIcon } from '../OpenInNewTabIcon'

import { ButtonWrapper } from './ButtonWrapper'
import { DisabledReason } from './DisabledReason'

import type { BaseProps } from './types'
import type { ElementRef, ElementRefProps } from '../../types'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof Props<T> & ElementRefProps<T>
>

type Props<T extends ElementType> = Omit<BaseProps, 'variant' | 'disabledReason'> & {
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  elementAs?: T
  // tertiaryはAnchorButtonでは使用不可
  variant?: Exclude<BaseProps['variant'], 'tertiary'>
  inactiveReason?: BaseProps['disabledReason']
}

const classNameGenerator = tv({
  base: 'smarthr-ui-AnchorButton',
})

const AnchorButton = forwardRef(
  <T extends ElementType = 'a'>(
    {
      size = 'default',
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
      ...props
    }: PropsWithoutRef<Props<T>> & ElementProps<T>,
    ref: Ref<ElementRef<T>>,
  ): ReactElement => {
    const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

    const actualSuffix = useMemo(() => {
      if (target === '_blank' && !prefix && !suffix) {
        return <OpenInNewTabIcon />
      }

      return suffix
    }, [prefix, suffix, target])

    const button = (
      <ButtonWrapper
        {...props}
        size={size}
        wide={wide}
        variant={variant}
        className={actualClassName}
        target={target}
        rel={rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel}
        isAnchor
        anchorRef={ref}
        elementAs={elementAs}
        prefix={prefix}
        suffix={actualSuffix}
      >
        {children}
      </ButtonWrapper>
    )

    if (!props.href && inactiveReason) {
      return <DisabledReason button={button} disabledReason={inactiveReason} />
    }

    return button
  },
)

// 型キャストなしで ForwardRefExoticComponent に合わせた型をエクスポートするための処理
type AnchorButtonType = <T extends ElementType = 'a'>(
  props: Props<T> & ElementProps<T> & ElementRefProps<T>,
) => ReturnType<FC>

const ForwardedAnchorButton = AnchorButton as unknown as AnchorButtonType & {
  displayName: string
}

// BottomFixedArea での判定に用いるために displayName を明示的に設定する
ForwardedAnchorButton.displayName = 'AnchorButton'

export { ForwardedAnchorButton as AnchorButton }
