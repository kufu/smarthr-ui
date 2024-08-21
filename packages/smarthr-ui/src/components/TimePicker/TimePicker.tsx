import React, { ComponentPropsWithoutRef, forwardRef } from 'react'
import { tv } from 'tailwind-variants'

type Props = {
  /** フォームにエラーがあるかどうか */
  error?: boolean
}
type ElementProps = Omit<ComponentPropsWithoutRef<'input'>, keyof Props>

const wrapper = tv({
  base: [
    'smarthr-ui-TimePicker',
    'shr-inline-block shr-border-shorthand shr-rounded-m shr-bg-white shr-px-0.5 shr-leading-none',
    'contrast-more:shr-border-high-contrast',
    'focus-within:shr-focus-indicator',
  ],
  variants: {
    disabled: {
      true: 'shr-pointer-events-none shr-bg-white-darken [&&&]:shr-border-default/50',
    },
    error: {
      true: '[&]:shr-border-danger',
    },
    readOnly: {
      true: '[&&&]:shr-border-[theme(backgroundColor.background)] [&&&]:shr-bg-background',
    },
  },
})

const inner = tv({
  slots: {
    input:
      'shr-border-none shr-text-base shr-bg-transparent shr-text-black shr-outline-none shr-outline-0 shr-p-[unset] shr-py-0.75 shr-h-[theme(fontSize.base)] shr-tabular-nums',
  },
})

export const TimePicker = forwardRef<HTMLInputElement, Props & ElementProps>(
  ({ disabled, error, readOnly, className, ...rest }, ref) => {
    const wrapperStyle = wrapper({ disabled, error, readOnly, className })
    const { input } = inner()
    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control */}
        <input
          {...rest}
          ref={ref}
          type="time"
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error || undefined}
          className={input()}
        />
      </span>
    )
  },
)
