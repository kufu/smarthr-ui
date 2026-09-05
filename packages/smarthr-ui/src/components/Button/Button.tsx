import { type ButtonHTMLAttributes, forwardRef, useId, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DisabledReason } from './DisabledReason'
import { ActualButton, LoadingStatus } from './client'

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
      id,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId()
    const buttonId = id || generatedId
    const classNames = useMemo(() => {
      const { wrapper } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
      }
    }, [className])

    const button = (
      <ActualButton
        {...rest}
        buttonRef={ref}
        type={type}
        id={buttonId}
        disabled={disabled}
        $loading={loading}
        variant={variant}
        size={size}
        wide={wide}
        className={classNames.wrapper}
        prefix={prefix}
        suffix={suffix}
      >
        <LoadingStatus buttonId={buttonId} loading={loading} />
        {children}
      </ActualButton>
    )

    if (disabled && disabledReason) {
      return <DisabledReason disabledReason={disabledReason} button={button} />
    }

    return button
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'
