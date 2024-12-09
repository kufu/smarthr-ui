'use client'

import React, { ButtonHTMLAttributes, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { usePortal } from '../../hooks/usePortal'
import { DecoratorsType } from '../../types'
import { Loader } from '../Loader'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ButtonInner } from './ButtonInner'
import { ButtonWrapper } from './ButtonWrapper'
import { DisabledDetail } from './DisabledDetail'
import { BaseProps } from './types'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

const buttonStyle = tv({
  slots: {
    wrapper: 'smarthr-ui-Button',
    loader: [
      'shr-align-bottom',
      '[&_.smarthr-ui-Loader-spinner]:shr-h-em [&_.smarthr-ui-Loader-spinner]:shr-w-em',
    ],
  },
  variants: {
    isSecondary: {
      true: {
        loader: '[&_.smarthr-ui-Loader-line]:shr-border-disabled',
      },
      false: {
        loader: [
          '[&_.smarthr-ui-Loader-line]:shr-border-white/50',
          '[&_.smarthr-ui-Loader-line]:forced-colors:shr-border-[ButtonBorder]',
        ],
      },
    },
  },
})

export type Props = {
  decorators?: DecoratorsType<'loading'>
}

const LOADING_TEXT = '処理中'

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps & Props>(
  (
    {
      type = 'button',
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      disabledDetail,
      className,
      children,
      loading = false,
      decorators,
      ...props
    },
    ref,
  ) => {
    const { wrapper, loader: loaderSlot } = buttonStyle()
    const wrapperStyle = useMemo(() => wrapper({ className }), [className, wrapper])
    const loaderStyle = useMemo(
      () => loaderSlot({ isSecondary: variant === 'secondary' }),
      [loaderSlot, variant],
    )
    const { createPortal } = usePortal()

    const loader = <Loader size="s" className={loaderStyle} role="presentation" />
    const actualPrefix = !loading && prefix
    const actualSuffix = loading && !square ? loader : suffix
    const disabledOnLoading = loading || disabled
    const actualChildren = loading && square ? loader : children

    const statusText = useMemo(() => {
      const loadingText = decorators?.loading?.(LOADING_TEXT) ?? LOADING_TEXT
      return loading ? loadingText : ''
    }, [decorators, loading])

    const button = (
      <ButtonWrapper
        {...props}
        type={type}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={wrapperStyle}
        buttonRef={ref}
        disabled={disabledOnLoading}
        $loading={loading}
      >
        {
          // `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
          createPortal(<VisuallyHiddenText role="status">{statusText}</VisuallyHiddenText>)
        }
        <ButtonInner prefix={actualPrefix} suffix={actualSuffix} size={size}>
          {actualChildren}
        </ButtonInner>
      </ButtonWrapper>
    )

    if (disabled && disabledDetail) {
      return <DisabledDetail button={button} disabledDetail={disabledDetail} />
    }

    return button
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
