'use client'

import { type ButtonHTMLAttributes, forwardRef, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { usePortal } from '../../hooks/usePortal'
import { Localizer } from '../../intl'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ButtonWrapper } from './ButtonWrapper'
import { DisabledReason } from './DisabledReason'

import type { BaseProps } from './types'

type Props = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Button',
  },
})

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      type = 'button',
      size = 'M',
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      disabledReason,
      className,
      children,
      loading = false,
      ...rest
    },
    ref,
  ) => {
    const classNames = useMemo(() => {
      const { wrapper } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
      }
    }, [className])

    const button = (
      <ButtonWrapper
        {...rest}
        buttonRef={ref}
        type={type}
        disabled={disabled}
        $loading={loading}
        variant={variant}
        size={size}
        wide={wide}
        className={classNames.wrapper}
        prefix={prefix}
        suffix={suffix}
      >
        <LoadingStatus loading={loading} />
        {children}
      </ButtonWrapper>
    )

    if (disabled && disabledReason) {
      return <DisabledReason disabledReason={disabledReason} button={button} />
    }

    return button
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'

const LoadingStatus = memo<{ loading: boolean }>(({ loading }) => {
  const { createPortal } = usePortal()

  // `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
  return createPortal(
    <VisuallyHiddenText role="status">
      {loading && <Localizer id="smarthr-ui/Button/loading" defaultText="処理中" />}
    </VisuallyHiddenText>,
  )
})
