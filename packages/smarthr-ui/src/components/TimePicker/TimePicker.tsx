import React, { ComponentPropsWithoutRef, forwardRef } from 'react'
import { tv } from 'tailwind-variants'

type Props = ComponentPropsWithoutRef<'input'>

const timePicker = tv({
  slots: {
    wrapper: [
      'smarthr-ui-TimePicker',
      'shr-inline-block shr-border-shorthand shr-rounded-m shr-bg-white shr-px-0.5 shr-leading-none',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
    ],
    input:
      'shr-border-none shr-text-base shr-text-black shr-outline-none shr-outline-0 shr-p-[unset] shr-py-0.75 shr-h-[theme(fontSize.base)] shr-tabular-nums',
  },
})

export const TimePicker: React.FC<Props> = forwardRef<HTMLInputElement, Props>(
  ({ className, ...rest }, ref) => {
    const { wrapper, input } = timePicker()
    return (
      <span className={wrapper({ className })}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute, smarthr/a11y-input-in-form-control */}
        <input {...rest} ref={ref} type="time" className={input()} />
      </span>
    )
  },
)
