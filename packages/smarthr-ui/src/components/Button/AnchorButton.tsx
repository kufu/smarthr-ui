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

import { ButtonWrapper } from './ButtonWrapper'
import { DisabledDetail } from './DisabledDetail'

import type { BaseProps } from './types'
import type { ElementRef, ElementRefProps } from '../../types'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof Props<T> & ElementRefProps<T>
>

type Props<T extends ElementType> = Omit<PropsWithoutRef<BaseProps>, keyof ElementProps<T>> &
  Omit<ElementProps<T>, 'href'> & {
    /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
    elementAs?: T
    href: string | undefined
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
      disabledDetail,
      target,
      rel,
      elementAs,
      className,
      children,
      ...props
    }: Props<T>,
    ref: Ref<ElementRef<T>>,
  ): ReactElement => {
    const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

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
        suffix={suffix}
      >
        {children}
      </ButtonWrapper>
    )

    if (!props.href && disabledDetail) {
      return <DisabledDetail button={button} disabledDetail={disabledDetail} />
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
