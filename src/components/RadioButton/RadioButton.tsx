import React, { ComponentPropsWithRef, PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useId } from '../../hooks/useId'

import { RadioButtonInput } from './RadioButtonInput'

type Props = PropsWithChildren<ComponentPropsWithRef<typeof RadioButtonInput>>

const radioButton = tv({
  slots: {
    wrapper: 'smarthr-ui-RadioButton shr-inline-flex shr-items-baseline',
    radioButton: 'smarthr-ui-RadioButton-radioButton shr-flex shr-items-center',
    label:
      'smarthr-ui-RadioButton-label shr-ms-0.5 shr-cursor-pointer shr-text-base shr-leading-tight shr-text-black',
  },
  variants: {
    disabled: {
      true: {
        label: 'shr-cursor-not-allowed shr-text-disabled',
      },
    },
  },
})

export const RadioButton = forwardRef<HTMLInputElement, Props>(
  ({ children, className, ...props }, ref) => {
    const { wrapperStyle, labelStyle } = useMemo(() => {
      const { wrapper, label } = radioButton()
      return {
        wrapperStyle: wrapper({ className }),
        labelStyle: label({ disabled: props.disabled }),
      }
    }, [className, props.disabled])

    const radioButtonId = useId(props.id)

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <RadioButtonInput {...props} ref={ref} id={radioButtonId} />

        {children && (
          <label htmlFor={radioButtonId} className={labelStyle}>
            {children}
          </label>
        )}
      </span>
    )
  },
)
