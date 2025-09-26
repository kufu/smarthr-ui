'use client'

import { type ComponentPropsWithRef, forwardRef, useId } from 'react'
import { tv } from 'tailwind-variants'

import { UnlabeledRadioButton } from './UnlabeledRadioButton'

type Props = ComponentPropsWithRef<'input'> & {
  children: React.ReactNode
}

const classNameGenerator = tv({
  slots: {
    label: [
      'smarthr-ui-RadioButton-label shr-ms-0.5 shr-text-base shr-leading-tight',
      'shr-cursor-pointer',
      '[[data-disabled="true"]>&]:shr-cursor-[revert] [[data-disabled="true"]>&]:shr-text-disabled',
    ],
  },
})

export const RadioButton = forwardRef<HTMLInputElement, Props>(
  ({ onChange, children, className, required, ...props }, ref) => {
    const { label } = classNameGenerator()
    const defaultId = useId()
    const radioButtonId = props.id || defaultId

    return (
      <UnlabeledRadioButton
        {...props}
        id={radioButtonId}
        ref={ref}
        className={className}
        required={required}
      >
        <label htmlFor={radioButtonId} className={label()}>
          {children}
        </label>
      </UnlabeledRadioButton>
    )
  },
)
