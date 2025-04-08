'use client'

import { type ButtonHTMLAttributes, type PropsWithChildren, forwardRef, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { usePortal } from '../../hooks/usePortal'
import { Loader } from '../Loader'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ButtonWrapper } from './ButtonWrapper'
import { DisabledDetail } from './DisabledDetail'

import type { BaseProps } from './types'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

const classNameGenerator = tv({
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
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

const DECORATOR_DEFAULT_TEXTS = {
  loading: '処理中',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps & Props>(
  (
    {
      type = 'button',
      size = 'default',
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
    const classNames = useMemo(() => {
      const { wrapper, loader } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        loader: loader({ isSecondary: variant === 'secondary' }),
      }
    }, [variant, className])

    const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

    const button = (
      <ButtonWrapper
        {...props}
        buttonRef={ref}
        type={type}
        size={size}
        wide={wide}
        variant={variant}
        className={classNames.wrapper}
        loader={
          loading ? (
            <Loader size="s" className={classNames.loader} role="presentation" />
          ) : undefined
        }
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
      >
        <LoadingStatus loading={loading}>{decorated.loading}</LoadingStatus>
        {children}
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

const LoadingStatus = memo<PropsWithChildren<{ loading: boolean }>>(({ loading, children }) => {
  const { createPortal } = usePortal()

  // `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
  return createPortal(<VisuallyHiddenText role="status">{loading && children}</VisuallyHiddenText>)
})
