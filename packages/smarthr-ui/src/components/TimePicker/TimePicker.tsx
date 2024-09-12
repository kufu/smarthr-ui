import React, { ComponentPropsWithoutRef, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}
type ElementProps = Omit<ComponentPropsWithoutRef<'input'>, keyof Props>

const timePicker = tv({
  slots: {
    wrapper: [
      'smarthr-ui-TimePicker',
      'shr-inline-block shr-border-shorthand shr-rounded-m shr-bg-white shr-px-0.5 shr-leading-none',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
    ],
    inner: [
      'shr-border-none shr-text-base disabled:shr-text-disabled shr-bg-transparent shr-text-black shr-outline-none shr-outline-0 shr-p-[unset] shr-py-0.75 shr-h-[theme(fontSize.base)] shr-tabular-nums',
    ],
  },
  variants: {
    disabled: {
      true: {
        wrapper: 'shr-pointer-events-none shr-bg-white-darken [&&&]:shr-border-default/50',
      },
    },
    error: {
      true: {
        wrapper: '[&]:shr-border-danger',
      },
    },
    readOnly: {
      true: {
        wrapper: '[&&&]:shr-border-[theme(backgroundColor.background)] [&&&]:shr-bg-background',
      },
    },
  },
})

export const TimePicker = forwardRef<HTMLInputElement, Props & ElementProps>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const { wrapperStyle, innerStyle } = useMemo(() => {
      const { wrapper, inner } = timePicker()
      return {
        wrapperStyle: wrapper({ className, disabled, error, readOnly }),
        innerStyle: inner(),
      }
    }, [disabled, error, readOnly, className])

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          data-smarthr-ui-input="true"
          ref={ref}
          type="time"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={innerStyle}
        />
      </span>
    )
  },
)
