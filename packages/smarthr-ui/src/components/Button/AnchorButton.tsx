import React, {
  ComponentPropsWithoutRef,
  ElementType,
  FC,
  ReactElement,
  forwardRef,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { ElementRef, ElementRefProps } from '../../types'

import { ButtonInner } from './ButtonInner'
import { ButtonWrapper } from './ButtonWrapper'
import { BaseProps } from './types'

type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  keyof Props<T> & ElementRefProps<T>
>

type Props<T extends ElementType> = BaseProps & {
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  elementAs?: T
}

const anchorButton = tv({
  base: 'smarthr-ui-AnchorButton',
})

const AnchorButton = forwardRef(
  <T extends ElementType = 'a'>(
    {
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      target,
      rel,
      elementAs,
      className,
      children,
      ...props
    }: Props<T> & ElementProps<T>,
    ref: ElementRef<T>,
  ): ReactElement => {
    const styles = useMemo(() => anchorButton({ className }), [className])
    const actualRel = useMemo(
      () => (rel === undefined && target === '_blank' ? 'noopener noreferrer' : rel),
      [rel, target],
    )

    return (
      <ButtonWrapper
        {...props}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={styles}
        target={target}
        rel={actualRel}
        isAnchor
        anchorRef={ref}
        elementAs={elementAs}
      >
        <ButtonInner prefix={prefix} suffix={suffix} size={size}>
          {children}
        </ButtonInner>
      </ButtonWrapper>
    )
  },
)

// 型キャストなしで ForwardRefExoticComponent に合わせた型をエクスポートするための処理
type AnchorButtonType = <T extends ElementType = 'a'>(
  props: Props<T> & ElementProps<T> & ElementRefProps<T>,
) => ReturnType<FC>

const ForwardedAnchorButton = AnchorButton as unknown as AnchorButtonType & {
  displayName: string
}

ForwardedAnchorButton.displayName = 'AnchorButton'

export { ForwardedAnchorButton as AnchorButton }
